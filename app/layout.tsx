import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { getProfile } from "@/lib/data";
import { ChatWidget } from "@/components/chat/chat-widget";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? "Krish Makadia";
  const title = `${name} — Portfolio`;
  const description =
    profile?.heroTagline ??
    "Software engineer working across distributed systems, full-stack, and AI.";
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(url),
    title: { default: title, template: `%s · ${name}` },
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/icon.svg" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${fraunces.variable} ${plexMono.variable} font-sans scrollbar-thin`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
        >
          {children}
          <ChatWidget />
          <Toaster
            theme="light"
            position="top-center"
            toastOptions={{
              style: {
                background: "hsl(44 40% 97%)",
                border: "1px solid hsl(30 14% 9%)",
                borderRadius: "2px",
                color: "hsl(30 14% 9%)",
                boxShadow: "4px 4px 0 0 hsl(30 14% 9%)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
