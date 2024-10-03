import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            MindAxis
          </CardTitle>
          <CardDescription className="text-center">
            Turn goals into actionable roadmaps
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          {session && session.user ? (
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
