import { MainNav } from "@/components/main-nav";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import type { AuthenticatedSession } from "@/types";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as AuthenticatedSession;

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-24">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
