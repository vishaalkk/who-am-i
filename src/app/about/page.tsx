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
          <h1 className="text-4xl font-bold text-ink mb-8 italic font-serif">About</h1>
          <div className="prose prose-emerald">
            <p className="text-xl text-emerald-mid/80 leading-relaxed mb-8 font-serif italic">
              I'm Vishal. A data engineer by day, keeping myself alive with everything else you see here.
            </p>
            <div className="space-y-6 text-lg text-emerald-mid/70 leading-relaxed">
              <p>
                Whether it's experimenting with the web, diving into literature, or enjoying a slow pint of Guinness—this is my space for documenting the journey.
              </p>
              <p>
                This site serves as a digital home for my projects, a library of excerpts that have moved me, and a collection of articles that I find worth sharing.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
