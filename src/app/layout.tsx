import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apple Archive',
  description: 'A curated history of revolutionary products and ideas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
