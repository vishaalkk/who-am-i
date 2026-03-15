"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-[80vh] px-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-ink mb-12 font-serif leading-[1.2]">
              The genesis of my existence lies in the womb of envy.
            </h1>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
