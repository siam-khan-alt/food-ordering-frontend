import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-2xl font-black text-text-main mb-2">Page Not Found</h2>
      <p className="text-muted mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="text-brand font-bold hover:underline">
        Go Home
      </Link>
    </div>
  );
}
