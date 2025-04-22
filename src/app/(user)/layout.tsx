import { SidebarProvider } from "@/components/ui/sidebar";
import MenuSidebar from "@/components/menu-sidebar";
import Topbar from "@/components/topbar";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <MenuSidebar />
        <div className="flex flex-col min-h-screen w-full">
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white sm:px-6 py-4 shadow-sm">
            <Topbar />
          </header>
          <main className="py-10 px-5 @container max-w-7xl mx-auto w-full">
            {children}
          </main>
          <footer className="mt-auto" />
        </div>
      </SidebarProvider>
    </>
  );
}
