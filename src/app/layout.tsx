import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import MenuSidebar from "@/components/menu-sidebar";
import Topbar from "@/components/topbar";

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
        <SidebarProvider>
          <MenuSidebar />
          <div className="flex flex-col min-h-screen w-full font-mont">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white sm:px-6 py-4 shadow-sm">
              <Topbar />
            </header>
            <main className="py-10 px-5 @container max-w-7xl mx-auto w-full">
              {children}
            </main>
            <footer className="mt-auto" />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
