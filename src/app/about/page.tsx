"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6 md:mb-8 font-serif">About</h1>
          <div className="max-w-prose text-base md:text-lg text-pine-mid/70 leading-relaxed space-y-6 md:space-y-8">
            <p>
              I&apos;m Vishal. A data engineer based out of Brooklyn. Apart from everyday&rsquo;s mundane, everything you see here keeps me going.
            </p>
            <p>
              My interests are primarily everything related to music, poetry, literature, languages, and tech. Currently, I am learning Persian, and Spanish.
            </p>
            <p>
              This site serves as a digital home for my projects, a library of excerpts that have moved me, and a collection of articles that I find worth sharing.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
