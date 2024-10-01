import { SignInForm } from "@/components/SignInForm";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1>MindAxis</h1>
      <h2>Turn goals into actionable roadmaps</h2>
      {session && session.user ? (
        <p>Welcome, {session.user.email}!</p>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
