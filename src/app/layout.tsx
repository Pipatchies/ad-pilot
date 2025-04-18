import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import MenuSidebar from "@/components/menu-sidebar";
import Topbar from "@/components/topbar";

const mont = localFont({
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
            <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
              <Topbar />
            </header>
            <main className="flex flex-col min-h-screen text-primary mt-16 md:pl-50 md:pr-50 px-4">
              {children}
            </main>
            <footer className="mt-auto" />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
