"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4 italic font-serif">Projects</h1>
          <p className="text-pine-mid/60 font-mono text-sm tracking-widest uppercase">Things I've built or am building.</p>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="project-card group p-8 rounded-2xl bg-white border border-pine-mid/5 flex flex-col h-full"
            >
              <div className={`w-12 h-12 rounded-xl ${project.color} ${project.textColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                <project.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ink group-hover:text-pine-dark transition-colors">
                {project.title}
              </h3>
              <p className="text-pine-mid/70 text-sm leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>
              <div className="pt-4 border-t border-pine-mid/5 flex items-center gap-2 text-xs font-mono text-pine-mid/40 group-hover:text-pine-dark transition-colors">
                View Project <ArrowRight size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
