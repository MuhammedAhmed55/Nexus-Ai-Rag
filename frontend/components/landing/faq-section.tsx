"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Does any of my data leave my machine?",
    a: "No. By default Nexus talks to a local Ollama instance for both embeddings and chat, and your documents are chunked and stored on disk. Nothing is sent to an external API unless you explicitly connect a cloud model.",
  },
  {
    q: "Which file types can I upload?",
    a: "PDFs, Word documents, Markdown, and plain text out of the box, plus pasted URLs for web pages. More formats are on the way.",
  },
  {
    q: "Which models does it support?",
    a: "Anything you can pull with Ollama — Llama 3.1, Mistral, Qwen 2.5, Gemma 2, and others — for chat, plus any local embedding model for retrieval.",
  },
  {
    q: "Do I need a GPU?",
    a: "It's recommended for larger models and faster answers, but small quantized models run fine on CPU. Nexus doesn't require any GPU of its own to function.",
  },
  {
    q: "Can I self-host this for my whole team?",
    a: "Yes. Nexus is built to run on a single machine or a shared server, with per-user document spaces and permissions.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            FAQ
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions, answered — no ticket required.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="bg-card/40">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {item.q}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-accent transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}