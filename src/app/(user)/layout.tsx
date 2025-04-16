"use client"
import Menu from "@/components/menu";
import Topbar from "@/components/topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Menu />
        <div className="flex flex-col w-full">
          <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <Topbar />
          </header>
          <main className="flex-1 px-6 py-8 overflow-y-auto">
            {children}
          </main>
          <footer className="mt-auto" />
        </div>
      </div>
    </SidebarProvider>
  )
}