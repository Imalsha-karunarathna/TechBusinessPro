import type React from 'react';

import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-50 to-gray-50 ">
        <Providers>
          {/* <Navbar /> */}
          <main className="pt-1">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
