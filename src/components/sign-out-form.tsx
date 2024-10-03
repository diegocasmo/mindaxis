"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await signOut({ redirect: false });
        router.push("/");
      } catch (error) {
        console.error("Sign out error:", error);
        setError("Sign out failed. Please try again.");
      }
    });
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleSignOut}
        disabled={isPending}
        variant="ghost"
        className="w-full justify-start"
      >
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
