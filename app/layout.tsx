"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <SessionProvider basePath={"/api/auth"}>
          {/* HEADER */}
          <header className="bg-black text-white sticky top-0 z-50">
            <Header />
          </header>

          {/* BODY */}
          <main className="bg-black text-white">{children}</main>

          {/* FOOTER */}
          <footer className="bg-black text-white">
            <Footer />
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
