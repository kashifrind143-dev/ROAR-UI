"use client";
import { Orbitron } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={orbitron.className}>
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
