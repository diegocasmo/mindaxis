import Link from "next/link";

export default async function Error() {
  return (
    <div className="w-full max-w-md p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center">
      <h1 className="text-2xl font-bold text-destructive">
        There was an error
      </h1>
      <p className="text-muted-foreground">Please try again later.</p>
      <Link
        href="/"
        className="inline-block mt-4 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Go back to the home page
      </Link>
    </div>
  );
}
