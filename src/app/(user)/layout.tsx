'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import MenuSidebar from '@/components/menu-sidebar';
import Topbar from '@/components/topbar';
import { usePathname } from 'next/navigation';
import BackButton from '@/components/back-button';
import { Authenticated } from 'convex/react';
import { UserProvider, useUser } from '@/app/providers/user-provider';

function ImpersonationBanner() {
  const { isImpersonating, stopImpersonating, user } = useUser();
  if (!isImpersonating) return null;

  return (
    <div className='bg-primary text-white p-2 absolute top-[72px] left-0 right-0 z-50 flex justify-center items-center gap-4 shadow-md'>
      <p className='font-medium'>Vue Client : Vous voyez le tableau de bord de {user?.name}</p>
      <button
        onClick={stopImpersonating}
        className='px-3 py-1 bg-white text-primary rounded hover:bg-gray-100 text-sm font-semibold transition-colors'
      >
        Quitter la vue
      </button>
    </div>
  );
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBackButton =
    /^\/(targets|librairy|archived|invoices)\/[^\/]+$/.test(pathname) ||
    /\/campaign\/[^/]+\/librairy\/[^/]+$/.test(pathname) ||
    /\/campaign\/[^/]+\/invoices\/[^/]+$/.test(pathname);
  return (
    <>
      <Authenticated>
        <UserProvider>
          <SidebarProvider>
            <MenuSidebar variant='user' />
            <div className='flex flex-col min-h-screen w-full'>
              <header className='sticky top-0 z-50 border-b border-gray-200 sm:px-6 py-4 shadow-topbar bg-white '>
                <Topbar />
                <ImpersonationBanner />
              </header>
              {showBackButton ? (
                <main className='lg:py-20 px-6 py-10 w-full'>
                  <div className='flex flex-col lg:flex-row items-start gap-4 mb-10'>
                    <div className='shrink-0 lg:w-[100px]'>
                      <BackButton />
                    </div>
                    <div className='flex-1 w-full flex justify-center min-w-0'>
                      <div className='w-full max-w-[1400px] @container'>{children}</div>
                    </div>
                    <div className='shrink-0 lg:w-[100px] hidden lg:block' aria-hidden='true' />
                  </div>
                </main>
              ) : (
                <main className='py-20 px-4 @container max-w-[1400px] mx-auto w-full'>
                  {children}
                </main>
              )}
              <footer className='mt-auto' />
            </div>
          </SidebarProvider>
        </UserProvider>
      </Authenticated>
    </>
  );
}
