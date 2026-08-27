import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <div className="glass glass-sheen max-w-md rounded-3xl px-10 py-14">
        <p className="text-shine text-8xl font-bold tracking-tighter">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          This page drifted away
        </h1>
        <p className="mt-3 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="glass-button mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background shadow-lg shadow-accent/30"
        >
          <Home size={16} aria-hidden="true" />
          Back home
        </Link>
      </div>
    </div>
  );
}
