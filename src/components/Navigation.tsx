"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Notes", path: "/notes" },
  { name: "Drafts", path: "/drafts" },
  { name: "About", path: "/about" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfcf7]/80 backdrop-blur-md border-b border-[#115e59]/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-[#064e3b] tracking-tight shrink-0 mr-4">
          V.
        </Link>
        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar items-center h-full">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "text-xs md:text-sm font-mono transition-colors relative h-10 flex items-center whitespace-nowrap px-1",
                pathname === item.path ? "text-[#064e3b]" : "text-[#115e59]/60 hover:text-[#064e3b]"
              )}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#064e3b]"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
