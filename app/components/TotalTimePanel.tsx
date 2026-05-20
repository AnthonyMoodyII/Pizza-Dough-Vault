'use client';
import { Schedule } from '@/lib/schedule';

type Props = { schedule: Schedule };

const dayShort = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: 'short' });
const timeShort = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

function formatDuration(startsAt: Date, endsAt: Date): string {
  const ms = endsAt.getTime() - startsAt.getTime();
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function TotalTimePanel({ schedule }: Props) {
  return (
    <div className="total-time-panel" role="status" aria-live="polite">
      <div className="ttp-total">
        Total Time: {formatDuration(schedule.startsAt, schedule.endsAt)}
      </div>
      <div className="ttp-line">
        Start Doughmanagement: {timeShort(schedule.startsAt)} ({dayShort(schedule.startsAt)})
      </div>
      {schedule.bulkEndsAt && (
        <div className="ttp-line">
          Bulk Fermentation End: {timeShort(schedule.bulkEndsAt)} ({dayShort(schedule.bulkEndsAt)})
        </div>
      )}
      {schedule.coldEndsAt && (
        <div className="ttp-line">
          Cold Fermentation End: {timeShort(schedule.coldEndsAt)} ({dayShort(schedule.coldEndsAt)})
        </div>
      )}
      <div className="ttp-line ttp-pizza">
        Pizza Time: {timeShort(schedule.endsAt)} ({dayShort(schedule.endsAt)})
      </div>
    </div>
  );
}
