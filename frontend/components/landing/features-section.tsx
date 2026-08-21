import { FolderUp, Cpu, Link2, Gauge } from "lucide-react";
import type { ComponentType } from "react";

const FEATURES: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    icon: FolderUp,
    title: "Upload anything",
    body: "Drop in PDFs, Word docs, Markdown, plain text, or paste a URL. Nexus chunks and indexes it in the background.",
  },
  {
    icon: Cpu,
    title: "Runs on Ollama",
    body: "Point Nexus at any model you've pulled locally — Llama, Mistral, Qwen, and more. No API keys, no rate limits.",
  },
  {
    icon: Link2,
    title: "Answers you can verify",
    body: "Every sentence is linked to the exact passage it came from, so you can check the source in one click.",
  },
  {
    icon: Gauge,
    title: "Built for recall",
    body: "Chunking and embeddings are tuned for accuracy over keyword luck, so the right passage surfaces every time.",
  },
];

export function FeaturesSection() {
  return (
    <section id="product" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Product
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything a RAG stack should do, none of the setup.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="glass group rounded-2xl p-5 transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}