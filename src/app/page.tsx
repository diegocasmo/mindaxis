import { SignInForm } from "@/components/sign-in-form";
import { auth } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function Home() {
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
      <CardContent>
        {session && session.user ? (
          <p className="text-center">Welcome, {session.user.email}!</p>
        ) : (
          <SignInForm />
        )}
      </CardContent>
    </Card>
  );
}
