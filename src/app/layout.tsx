import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Made by Apple - A Complete History of Apple Products',
  description: 'Explore the complete history of Apple products from 1976 to today.',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {modal}
      </body>
    </html>
  );
}