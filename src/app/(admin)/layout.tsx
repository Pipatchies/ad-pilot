"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import MenuSidebar from "@/components/menu-sidebar";
import Topbar from "@/components/topbar";
import { usePathname } from "next/navigation";
import BackButton from "@/components/back-button";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
    const showBackButton = /^\/(targets|librairy|archived)\/[^\/]+$/.test(pathname);
  return (
    <>
      <SidebarProvider>
        <MenuSidebar variant="admin" />
        <div className="flex flex-col min-h-screen w-full">
          <header className="sticky top-0 z-50 border-b border-gray-200 sm:px-6 py-4 shadow-topbar bg-white ">
            <Topbar variant="admin" />
          </header>
          {showBackButton ? (
          <main className="lg:py-20 lg:px-15 px-5 py-10 @container max-w-[1400px] w-full">
            <div className="flex flex-wrap lg:flex-nowrap items-start gap-15 mb-10">
              <BackButton />
              <div className="flex-1">{children}</div>
            </div>
            </main>
            ) : (
              <main className="py-20 p-5 @container max-w-7xl mx-auto w-full">{children}</main>
          )}
          <footer className="mt-auto" />
        </div>
      </SidebarProvider>
    </>
  );
}
