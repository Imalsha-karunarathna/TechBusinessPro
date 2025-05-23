import type React from 'react';

import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
//   variable: '--font-roboto',
// });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className=" bg-gradient-to-b from-gray-50 to-gray-50 ">
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
