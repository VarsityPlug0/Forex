import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ForexPro — Trading Education & Community Platform',
  description:
    'Master forex trading with expert education, PAMM accounts, and a thriving community of traders. Build real skills that respond to every market condition.',
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
