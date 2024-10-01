import Link from "next/link";

export default async function Error() {
  return (
    <div>
      <h1>There was an error</h1>
      <Link href="/">Go back to the home page</Link>
    </div>
  );
}
