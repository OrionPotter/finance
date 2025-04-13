import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
       <head>
        <meta charSet="utf-8" />
        <title>零X金融</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
      <Navbar />
      {children}</body>
    </html>
  );
}