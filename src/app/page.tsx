import { SignIn } from "@/components/SignIn";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Magic Link Auth</h1>
      {session && session.user ? (
        <p>Welcome, {session.user.email}!</p>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
