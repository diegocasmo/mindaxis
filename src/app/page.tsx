import { SignInForm } from "@/components/SignInForm";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="w-full max-w-md p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-center">MindAxis</h1>
      <h2 className="text-muted-foreground mb-6 text-center">
        Turn goals into actionable roadmaps
      </h2>
      {session && session.user ? (
        <p className="text-center">Welcome, {session.user.email}!</p>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
