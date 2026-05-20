import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoodyCrust',
  description: "Web-portal guide to pizza perfection — baker's math calculator, fermentation scheduler, and recipe vault.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
