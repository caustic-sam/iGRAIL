import Link from 'next/link';

// Top navigation bar (rendered from app/layout.tsx)
//
// IG-28: Nav trimmed to only routes that have real content at soft launch.
// Deferred routes (/policy-pulse, /videos, /deck, /wren, /policies,
// /quick-posts, /glossary) are kept as files but removed from visible nav
// so users never land on empty pages.
export default function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">
            iGRAIL
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {/* Live routes only — deferred routes intentionally omitted (IG-28) */}
            <Link href="/articles" className="hover:underline">Articles</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
        {/* Admin link kept but not advertised — internal use only */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded border px-3 py-1.5 text-sm hover:bg-foreground/10"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
