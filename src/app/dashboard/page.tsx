import { auth } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { SignOutForm } from "@/components/sign-out-form";
import type { AuthenticatedSession } from "@/types";

export default async function Dashboard() {
  const session = (await auth()) as AuthenticatedSession;

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
        <div className="text-center space-y-4">
          <p>Welcome, {session.user.email}!</p>
          <SignOutForm />
        </div>
      </CardFooter>
    </Card>
  );
}
