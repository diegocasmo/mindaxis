import Link from "next/link";

export default async function VerifyRequest() {
  return (
    <div>
      <h1>Check your email</h1>
      <p>A sign in link has been sent to your email address.</p>
      <Link href="/">Go back to the home page</Link>
    </div>
  );
}
