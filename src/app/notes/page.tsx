"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ExternalLink, Search, LayoutGrid, List, User, Globe, Link, Check } from "lucide-react";
import { writings } from "@/data/writings";
import { articles } from "@/data/articles";
import { poems } from "@/data/poems";
import { cn, slugify } from "@/lib/utils";

type TabType = 'excerpts' | 'articles' | 'poems';
type ViewMode = 'grid' | 'list';
type GroupBy = 'none' | 'author' | 'source';

interface NoteItem {
  title: string;
  excerpt: string;
  type: string;
  author?: string;
  tags?: string[];
  link?: string;
  source?: string;
}

function NotesContent() {
  const [activeTab, setActiveTab] = useState<TabType>('excerpts');
  const [selectedExcerpt, setSelectedExcerpt] = useState<NoteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentItems = useMemo(() => {
    let items: NoteItem[] = [];
    if (activeTab === 'excerpts') items = writings;
    if (activeTab === 'poems') items = poems;
    if (activeTab === 'articles') {
      return (articles.map(a => ({ ...a, excerpt: "", type: "Article" })) as NoteItem[]).filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.source?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return items.filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.author?.toLowerCase().includes(q)) ||
        (item.excerpt.toLowerCase().includes(q)) ||
        (item.source?.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  // Handle deep linking on mount
  useEffect(() => {
    const itemSlug = searchParams.get('item');
    if (itemSlug) {
      const allItems = [
        ...writings, 
        ...poems, 
        ...articles.map(a => ({ ...a, excerpt: "", type: "Article" }))
      ];
      const found = allItems.find(item => slugify(item.title) === itemSlug);
      if (found) {
        setSelectedExcerpt(found as NoteItem);
        if (found.type === 'Excerpt') setActiveTab('excerpts');
        if (found.type === 'Poem') setActiveTab('poems');
        if (found.type === 'Article') setActiveTab('articles');
      }
    }
  }, [searchParams]);

  const handleSelectExcerpt = (item: NoteItem) => {
    setSelectedExcerpt(item);
    if (item.type !== 'Article') {
      router.push(`${pathname}?item=${slugify(item.title)}`, { scroll: false });
    }
  };

  const handleCloseExcerpt = () => {
    setSelectedExcerpt(null);
    router.push(pathname, { scroll: false });
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!selectedExcerpt) return;
    const url = `${window.location.origin}${pathname}?item=${slugify(selectedExcerpt.title)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const groupedItems = useMemo(() => {
    if (groupBy === 'none') return { "All": currentItems };
    
    const groups: Record<string, NoteItem[]> = {};
    currentItems.forEach(item => {
      let key = "Unknown";
      if (groupBy === 'author') {
        key = item.author || "Unknown";
      } else if (groupBy === 'source' && activeTab === 'articles') {
        key = item.source || "Unknown";
      } else {
        key = "All";
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    if (groupBy === 'source' && activeTab !== 'articles') return { "All": currentItems };

    return groups;
  }, [currentItems, groupBy, activeTab]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200/60 text-ink rounded-sm px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderItem = (item: NoteItem, idx: number) => {
    if (activeTab === 'articles') {
      if (viewMode === 'list') {
        return (
          <motion.a
            key={item.title + idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            className="w-full text-left py-4 border-b border-pine-mid/5 flex items-center justify-between group transition-all"
          >
            <div className="flex items-baseline gap-4">
              <span className="text-ink font-serif text-lg group-hover:text-pine-dark transition-colors">
                {highlightText(item.title, searchQuery)}
              </span>
              <span className="text-sm text-pine-mid/40 font-mono italic">
                — {highlightText(item.source || "", searchQuery)}
                {item.author && ` • ${item.author}`}
              </span>
            </div>
            <ExternalLink size={14} className="text-pine-mid/20 group-hover:text-pine-dark transition-colors" />
          </motion.a>
        );
      }

      return (
        <motion.a 
          key={item.title + idx} 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 600, damping: 25 }}
          className="flex items-center justify-between p-6 rounded-xl border border-pine-mid/5 hover:bg-pine-dark/[0.02] transition-all group bg-white hover:shadow-lg hover:shadow-pine-dark/5"
        >
          <div>
            <h3 className="text-lg font-bold text-ink group-hover:text-pine-dark transition-colors">
              {highlightText(item.title, searchQuery)}
            </h3>
            <span className="text-xs font-mono text-pine-mid/40">
              {highlightText(item.source || "", searchQuery)}
              {item.author && ` • ${item.author}`}
            </span>
          </div>
          <ExternalLink size={18} className="text-pine-mid/20 group-hover:text-pine-dark transition-colors" />
        </motion.a>
      );
    }

    if (viewMode === 'list') {
      return (
        <motion.button
          key={item.title + idx}
          onClick={() => handleSelectExcerpt(item)}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 600, damping: 25 }}
          className="w-full text-left py-4 border-b border-pine-mid/5 flex items-center justify-between group transition-all"
        >
          <div className="flex items-baseline gap-4">
            <span className="text-ink font-serif text-lg group-hover:text-pine-dark transition-colors">
              {highlightText(item.title, searchQuery)}
            </span>
            {item.author && (
              <span className="text-sm text-pine-mid/40 font-mono italic">
                — {highlightText(item.author, searchQuery)}
              </span>
            )}
          </div>
          <ArrowRight size={14} className="text-pine-mid/20 group-hover:text-pine-dark transition-transform group-hover:translate-x-1" />
        </motion.button>
      );
    }

    return (
      <motion.button
        key={item.title + idx}
        onClick={() => handleSelectExcerpt(item)}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 600, damping: 20 }}
        className="text-left p-8 rounded-2xl bg-white border border-pine-mid/5 group hover:border-pine-mid/20 transition-all hover:shadow-xl hover:shadow-pine-dark/5 flex flex-col h-full"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-pine-mid/40">{item.type}</span>
        </div>
        <h3 className="text-xl font-bold text-ink mb-1 group-hover:text-pine-dark transition-colors">
          {highlightText(item.title, searchQuery)}
        </h3>
        {item.author && (
          <p className="text-xs font-mono text-pine-mid/40 mb-4 italic">
            by {highlightText(item.author, searchQuery)}
          </p>
        )}
        
        {item.excerpt && (
          <p className="text-pine-mid/80 font-serif text-base leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {highlightText(item.excerpt, searchQuery)}
          </p>
        )}
      </motion.button>
    );
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4 font-serif">Notes</h1>
          <p className="text-pine-mid/60 font-mono text-sm tracking-widest uppercase">Excerpts, articles, and poems i like.</p>
        </section>

        <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between border-b border-pine-mid/10 pb-8">
          <div className="flex flex-wrap gap-8">
            {(['excerpts', 'articles', 'poems'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setGroupBy('none'); }}
                className={`pb-4 text-sm font-mono transition-colors relative capitalize ${activeTab === tab ? 'text-pine-dark' : 'text-pine-mid/40 hover:text-pine-dark'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-px bg-pine-dark" />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pine-mid/30" size={14} />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-pine-mid/10 rounded-full text-sm font-mono focus:outline-none focus:border-pine-dark/20 w-full"
              />
            </div>

            <div className="flex bg-pine-dark/[0.03] p-1 rounded-lg border border-pine-mid/5">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-pine-dark" : "text-pine-mid/30")}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-pine-dark" : "text-pine-mid/30")}
              >
                <List size={16} />
              </button>
            </div>

            <button 
              onClick={() => setGroupBy(groupBy === 'author' ? 'none' : 'author')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-mono",
                groupBy === 'author' ? "bg-pine-dark text-white border-pine-dark" : "bg-white border-pine-mid/10 text-pine-mid/60"
              )}
            >
              <User size={14} /> {groupBy === 'author' ? 'Grouped by Author' : 'Group by Author'}
            </button>
            {activeTab === 'articles' && (
              <button 
                onClick={() => setGroupBy(groupBy === 'source' ? 'none' : 'source')}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-mono",
                  groupBy === 'source' ? "bg-pine-dark text-white border-pine-dark" : "bg-white border-pine-mid/10 text-pine-mid/60"
                )}
              >
                <Globe size={14} /> {groupBy === 'source' ? 'Grouped by Website' : 'Group by Website'}
              </button>
            )}
          </div>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + searchQuery + viewMode + groupBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Object.entries(groupedItems).map(([groupName, items]) => (
                <div key={groupName} className="mb-12 last:mb-0">
                  {groupBy !== 'none' && groupName !== "All" && (
                    <h2 className="text-xl font-bold text-pine-dark mb-6 border-l-2 border-pine-dark pl-4 font-serif">{groupName}</h2>
                  )}
                  <div className={cn(
                    viewMode === 'grid' ? "grid md:grid-cols-2 gap-6" : "space-y-2"
                  )}>
                    {items.map((item, idx) => renderItem(item, idx))}
                  </div>
                </div>
              ))}
              
              {currentItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-pine-mid/30">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="font-mono text-sm uppercase tracking-widest">No matching notes found</p>
                </div>
              )}
            </motion.div>
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
              className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-pine-mid/10"
            >
              <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full hover:bg-pine-dark/5 text-pine-mid/40 hover:text-pine-dark transition-all flex items-center gap-2"
                  title="Copy link to this note"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Link size={18} />}
                  {copied && <span className="text-xs font-mono text-green-600">Link copied!</span>}
                </button>
                <button
                  onClick={handleCloseExcerpt}
                  className="p-2 rounded-full hover:bg-pine-dark/5 text-pine-mid/40 hover:text-pine-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-w-2xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-pine-mid/40 mb-4 block mt-4 md:mt-0">
                  {selectedExcerpt.type}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-2">
                  {highlightText(selectedExcerpt.title, searchQuery)}
                </h2>
                {selectedExcerpt.author && (
                  <p className="text-sm font-mono text-pine-mid/40 mb-8 italic">
                    by {highlightText(selectedExcerpt.author, searchQuery)}
                  </p>
                )}
                <div className="prose prose-pine max-w-none">
                  <p className="text-[15px] sm:text-base md:text-lg text-pine-dark/90 font-serif leading-relaxed whitespace-pre-wrap text-justify">
                    {highlightText(selectedExcerpt.excerpt, searchQuery)}
                  </p>
                  {selectedExcerpt.source && (
                    <p className="mt-8 text-sm md:text-base font-serif italic text-pine-mid/80">
                      — {highlightText(selectedExcerpt.source, searchQuery)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={handleCloseExcerpt} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-6 text-center">
        <div className="animate-pulse font-mono text-pine-mid/40 uppercase tracking-widest text-sm">
          Loading Notes...
        </div>
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}
