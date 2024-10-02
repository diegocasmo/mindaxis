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
import { SignOutForm } from "@/components/sign-out-form";

export default async function Dashboard() {
  const session = await auth();

  return (
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
          <div className="text-center space-y-4">
            <p>Welcome, {session.user.email}!</p>
            <SignOutForm />
          </div>
        ) : (
          <Button asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
