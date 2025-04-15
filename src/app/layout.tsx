"use client";
import localFont from "next/font/local";
import "./globals.css";

const Mont = localFont({
  src: [
    {
      path: "./fonts/Fontfabric - Mont Black.otf"
      // weight: "400",
      // style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Bold.otf"
      // weight: "700",
      // style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Heavy.otf"
      // weight: "900",
      // style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Book.otf" 
    },
    {
    path: "./fonts/Fontfabric - Mont Light.otf"
    },
  ],
  variable: "--font-mont",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Mont.variable} antialiased overflow-x-hidden`}
      >
        <div className="font-[family-name:var(--font-mont)]">
        {/* Header */}
        {/* Logo */}
        <main className="relative flex flex-col min-h-screen justify-center">
          {/* Sidebar */}
          {children}
        </main>
        </div>
      </body>
    </html>
  );
}
