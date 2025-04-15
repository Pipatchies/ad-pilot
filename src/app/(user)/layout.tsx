import Menu from "@/components/menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
          <>
            <header className="w-full">
            </header>
            <div className="flex min-h-screen w-full">
              <Menu />
              <div className="flex-1 space-y-20">
                <main className="w-full flex flex-col items-center mx-auto space-y-20">
                  {children}
                </main>
                <footer></footer>
              </div>
            </div>
          </>
        </SidebarProvider>
      )
    }
