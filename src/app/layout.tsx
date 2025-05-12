"use client"
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";

const mont = localFont({
  src: [
    {
      path: "./fonts/montblack/Fontfabric - Mont Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Black.otf",
      weight: "900",
      style: "normal",
    },
    // Italic variants
    {
      path: "./fonts/montblack/Fontfabric - Mont Thin Italic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Regular Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Bold Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/montblack/Fontfabric - Mont Black Italic.otf",
      weight: "900",
      style: "italic",
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
    <html lang="fr">
      <body className={`${mont.variable} antialiased overflow-x-hidden`}>
        <div className="font-mont">
          <Toaster />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
      </body>
    </html>
  );
}
