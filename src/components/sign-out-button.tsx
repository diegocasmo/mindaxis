"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await signOut({ redirect: false });
        router.refresh();
      } catch (error) {
        console.error("Sign out error:", error);
        setError("Sign out failed. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <Button onClick={handleSignOut} disabled={isPending}>
          {isPending ? "Signing out..." : "Sign out"}
        </Button>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
