import { SignIn } from "@/components/SignIn";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Magic Link Auth</h1>
      <SignIn />
    </div>
  );
}
