import type React from 'react';

import './globals.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* <Navbar /> */}
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
