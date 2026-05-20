import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BakeUpdateSchema } from '@/lib/validation';

type Ctx = { params: Promise<{ id: string; bakeId: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { bakeId } = await params;
    const body = await request.json();
    const parsed = BakeUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (typeof data.bakedAt === 'string') data.bakedAt = new Date(data.bakedAt);
    const bake = await prisma.bake.update({ where: { id: bakeId }, data: data as never });
    return NextResponse.json(bake);
  } catch (error) {
    console.error('PUT /api/recipes/[id]/bakes/[bakeId]', error);
    return NextResponse.json({ error: 'Failed to update bake' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { bakeId } = await params;
    await prisma.bake.delete({ where: { id: bakeId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/recipes/[id]/bakes/[bakeId]', error);
    return NextResponse.json({ error: 'Failed to delete bake' }, { status: 500 });
  }
}
