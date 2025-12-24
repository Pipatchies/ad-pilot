"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import MenuSidebar from "@/components/menu-sidebar";
import Topbar from "@/components/topbar";
import { usePathname } from "next/navigation";
import BackButton from "@/components/back-button";
import { Authenticated } from "convex/react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBackButton = /^\/admin\/(targets|librairy|archived|clients)\/[^\/]+$/.test(
    pathname
  );
  return (
    <>
      <Authenticated>
        <SidebarProvider>
          <MenuSidebar variant="admin" />
          <div className="flex flex-col min-h-screen w-full">
            <header className="sticky top-0 z-50 border-b border-gray-200 sm:px-6 py-4 shadow-topbar bg-white ">
              <Topbar />
            </header>
            {showBackButton ? (
              <main className="lg:py-20 px-6 py-10 w-full">
                <div className="flex flex-col lg:flex-row items-start gap-4 mb-10">
                  <div className="shrink-0 lg:w-[100px]">
                    <BackButton />
                  </div>
                  <div className="flex-1 w-full flex justify-center min-w-0">
                    <div className="w-full max-w-[1400px] @container">{children}</div>
                  </div>
                  <div className="shrink-0 lg:w-[100px] hidden lg:block" aria-hidden="true" />
                </div>
              </main>
            ) : (
              <main className="py-20 px-5 @container max-w-[1400px] mx-auto w-full">
                {children}
              </main>
            )}
            <footer className="mt-auto" />
          </div>
        </SidebarProvider>
      </Authenticated>
    </>
  );
}
