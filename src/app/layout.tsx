import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <Navbar />
      <body>{children}</body>
    </html>
  );
}