"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ExternalLink } from "lucide-react";
import { writings } from "@/data/writings";
import { articles } from "@/data/articles";
import { poems } from "@/data/poems";

type TabType = 'excerpts' | 'articles' | 'poems';

interface NoteItem {
  title: string;
  excerpt: string;
  type: string;
  link?: string;
  source?: string;
}

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('excerpts');
  const [selectedExcerpt, setSelectedExcerpt] = useState<NoteItem | null>(null);

  const renderExcerpts = (items: NoteItem[]) => (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid md:grid-cols-2 gap-6"
    >
      {items.map((item, idx) => (
        <button
          key={item.title + idx}
          onClick={() => setSelectedExcerpt(item)}
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
        </button>
      ))}
    </motion.div>
  );

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4 italic font-serif">Notes</h1>
          <p className="text-pine-mid/60 font-mono text-sm tracking-widest uppercase">Excerpts, articles, and poems i like.</p>
        </section>

        <div className="flex justify-start gap-8 mb-12 border-b border-pine-mid/10">
          {(['excerpts', 'articles', 'poems'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-mono transition-colors relative capitalize ${activeTab === tab ? 'text-pine-dark' : 'text-pine-mid/40 hover:text-pine-dark'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-px bg-pine-dark" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'excerpts' && renderExcerpts(writings)}
            
            {activeTab === 'poems' && renderExcerpts(poems)}

            {activeTab === 'articles' && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-4"
              >
                {articles.map((item, idx) => (
                  <a 
                    key={item.title} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-xl border border-pine-mid/5 hover:bg-pine-dark/[0.02] transition-colors group"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-ink group-hover:text-pine-dark transition-colors">{item.title}</h3>
                      <span className="text-xs font-mono text-pine-mid/40">{item.source}</span>
                    </div>
                    <ExternalLink size={18} className="text-pine-mid/20 group-hover:text-pine-dark transition-colors" />
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedExcerpt && (
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
                onClick={() => setSelectedExcerpt(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-pine-dark/5 text-pine-mid/40 hover:text-pine-dark transition-colors"
              >
                <X size={20} />
              </button>

              <div className="max-w-2xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-pine-mid/40 mb-4 block">
                  {selectedExcerpt.type}
                </span>
                <h2 className="text-3xl font-bold text-ink mb-8">
                  {selectedExcerpt.title}
                </h2>
                <div className="prose prose-pine">
                  <p className="text-lg md:text-xl text-pine-dark/90 font-serif leading-relaxed whitespace-pre-wrap">
                    {selectedExcerpt.excerpt}
                  </p>
                </div>
                {selectedExcerpt.link && (
                  <a 
                    href={selectedExcerpt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-12 flex items-center gap-2 text-xs font-mono text-pine-mid/40 hover:text-pine-dark transition-colors inline-flex group"
                  >
                    Original Source <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedExcerpt(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
