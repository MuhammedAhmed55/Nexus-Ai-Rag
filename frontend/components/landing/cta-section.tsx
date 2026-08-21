import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="glass-strong relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-16 text-center sm:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40rem 20rem at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Stop skimming. Start asking.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Point Nexus at your documents and your local Ollama models —
            you'll have a cited answer before the kettle boils.
          </p>
          <a
            href="#get-started"
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground outline-none transition-transform hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}