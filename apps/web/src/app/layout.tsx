import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Classroom Platform',
  description: 'Unified Academic & Collaborative Communication Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#313338] text-gray-100 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
