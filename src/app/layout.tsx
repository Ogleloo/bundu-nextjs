// ============================================================
// ROOT LAYOUT — wraps every page
// Loads global styles + fonts. Navbar/Footer added per-page
// (dashboard and auth pages don't use the public Navbar/Footer)
// ============================================================
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bundu-nextjs.vercel.app"),
  title: "Bundu Foods — Restaurant & Lounge, KwaDlangezwa",
  description: "Traditional meals, wings, burgers and platters near UniZulu. Order on your phone, collect at the counter.",
  icons: { icon: "/logo/icon-32.png", apple: "/logo/icon-180.png" },
  openGraph: {
    images: ["/logo/og-image.jpg"],
    title: "Bundu Foods",
    description: "Real food, cooked fresh, five minutes from campus.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
