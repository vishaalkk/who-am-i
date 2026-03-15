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

export const metadata: Metadata = {
  title: "V.",
  description: "A personal space for my projects and interests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${mono.variable} ${sans.variable} font-sans selection:bg-emerald-mid/20`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="py-12 border-t border-emerald-mid/10 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm font-mono text-emerald-mid/60">
            © {new Date().getFullYear()} — Built with precision and purpose.
          </div>
        </footer>
      </body>
    </html>
  );
}
