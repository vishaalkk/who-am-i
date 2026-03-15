"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { personal } from "@/data/personal";

interface DraftItem {
  title: string;
  excerpt: string;
  type: string;
}

export default function DraftsPage() {
  const [selectedDraft, setSelectedDraft] = useState<DraftItem | null>(null);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4 italic font-serif">Drafts</h1>
          <p className="text-pine-mid/60 font-mono text-sm tracking-widest uppercase">My personal poetry and unfinished thoughts.</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {personal.map((item, idx) => (
            <motion.button
              key={item.title + idx}
              onClick={() => setSelectedDraft(item)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-left p-8 rounded-2xl bg-white border border-pine-mid/5 group hover:border-pine-mid/20 transition-all hover:shadow-lg hover:shadow-pine-dark/5"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-pine-mid/40 mb-2 block">{item.type}</span>
              <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-pine-dark transition-colors">{item.title}</h3>
              <p className="text-pine-mid/80 font-serif text-base leading-relaxed line-clamp-3 whitespace-pre-wrap">
                {item.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-pine-dark opacity-0 group-hover:opacity-100 transition-opacity">
                Read Full {item.type} <ArrowRight size={10} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedDraft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-paper/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-pine-mid/10"
            >
              <button
                onClick={() => setSelectedDraft(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-pine-dark/5 text-pine-mid/40 hover:text-pine-dark transition-colors"
              >
                <X size={20} />
              </button>

              <div className="max-w-2xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-pine-mid/40 mb-4 block">
                  {selectedDraft.type}
                </span>
                <h2 className="text-3xl font-bold text-ink mb-8">
                  {selectedDraft.title}
                </h2>
                <div className="prose prose-pine">
                  <p className="text-lg md:text-xl text-pine-dark/90 font-serif leading-relaxed whitespace-pre-wrap">
                    {selectedDraft.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedDraft(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
