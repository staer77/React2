import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen py-2">
      <h1>Root layout</h1>
      <div className="mt-6">
        <Link href={{pathname: "/blog",
          query: { name: "test", age: 30 }
        }}>
          Go to Blog
        </Link>
      </div>
    </div>
  );
}