import { MainNav } from "@/components/main-nav";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "./client-providers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <ClientProviders session={session}>
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow py-8">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </ClientProviders>
  );
}
