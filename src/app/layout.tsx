import type { Metadata } from "next";
import { Libre_Baskerville, JetBrains_Mono, Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/Navigation";

const serif = Libre_Baskerville({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  variable: "--font-serif",
});

const mono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

const sans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const description = "A personal space for my projects and interests.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vishkk.com"),
  title: "V.",
  description,
  openGraph: {
    type: "website",
    siteName: "V.",
    title: "V.",
    description,
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "V." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "V.",
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${mono.variable} ${sans.variable} font-sans selection:bg-pine-mid/20`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="py-12 border-t border-[#115e59]/10 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm font-mono text-[#115e59]/60">
            © {new Date().getFullYear()} — Reading, writing, building.
          </div>
        </footer>
      </body>
    </html>
  );
}
