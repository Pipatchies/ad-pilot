import localFont from "next/font/local";
import "./globals.css";

const Mont = localFont({
  src: [
    {
      path: "./fonts/Fontfabric - Mont Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont Regular.otf",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./fonts/Fontfabric - Mont SemiBold.otf",
      weight: "600",
      style: "normal",
    }
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
