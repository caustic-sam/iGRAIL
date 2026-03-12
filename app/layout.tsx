// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { RightSidebar } from "@/components/RightSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "iGRAIL — Global Policy Intelligence",
  description:
    "Policy intelligence for AI, identity, interoperability, and digital governance.",
  openGraph: {
    title: "iGRAIL — Global Policy Intelligence",
    description:
      "Policy intelligence for AI, identity, interoperability, and digital governance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iGRAIL — Global Policy Intelligence",
    description:
      "Policy intelligence for AI, identity, interoperability, and digital governance.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Tailwind v4 tokens: bg/text come from styles/globals.css @theme */}
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <Header />
          <div className="flex">
            <main className="flex-1">
              {children}
            </main>
            <RightSidebar />
          </div>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
