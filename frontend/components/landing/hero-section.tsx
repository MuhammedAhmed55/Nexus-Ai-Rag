"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, PlayCircle } from "lucide-react";

type Segment =
  | { type: "text"; value: string }
  | { type: "cite"; value: string; source: string };

const ANSWER: Segment[] = [
  { type: "text", value: "Enterprise customers can request a full refund within 30 days of purchase " },
  { type: "cite", value: "[1]", source: "Refund_Policy.pdf · p. 4" },
  { type: "text", value: ". After that window, refunds are prorated based on unused seats through the end of the billing term " },
  { type: "cite", value: "[2]", source: "Enterprise_MSA.docx · p. 12" },
  { type: "text", value: "." },
];

const QUESTION = "What's our refund policy for enterprise customers?";

/** Flattened stream of characters/citation-tokens for the typewriter. */
type Tick =
  | { kind: "char"; value: string }
  | { kind: "cite"; value: string; source: string };

function buildTicks(): Tick[] {
  const ticks: Tick[] = [];
  for (const seg of ANSWER) {
    if (seg.type === "text") {
      for (const ch of seg.value) ticks.push({ kind: "char", value: ch });
    } else {
      ticks.push({ kind: "cite", value: seg.value, source: seg.source });
    }
  }
  return ticks;
}

const TICKS = buildTicks();

export function HeroSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [citesShown, setCitesShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setVisibleCount(TICKS.length);
      setCitesShown(
        TICKS.filter((t) => t.kind === "cite").map((t) => (t as { source: string }).source)
      );
      setDone(true);
      return;
    }

    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const step = () => {
      if (i >= TICKS.length) {
        setDone(true);
        return;
      }
      i += 1;
      setVisibleCount(i);
      const tick = TICKS[i - 1];
      if (tick.kind === "cite") {
        setCitesShown((prev) => [...prev, tick.source]);
      }
      const delay = tick.kind === "cite" ? 260 : 18 + Math.random() * 22;
      timers.push(setTimeout(step, delay));
    };

    const start = setTimeout(step, 900);
    timers.push(start);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Left: thesis */}
        <div className="animate-fade-up">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Local-first RAG, powered by Ollama
          </div>

          <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Ask your documents{" "}
            <span className="text-gradient">anything.</span>
          </h1>

          <p className="mt-5 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Nexus AI reads your PDFs, docs, and pages, then answers in
            seconds — every claim linked back to the exact source. Runs on
            local models through Ollama, so nothing leaves your machine.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#get-started"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-transform hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-foreground/90 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PlayCircle className="h-4 w-4" />
              See how it works
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              ["100%", "runs offline"],
              ["0", "docs sent to the cloud"],
              ["<2s", "typical answer time"],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {stat}
                </dt>
                <dd className="mt-0.5 text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: the signature moment — a grounded answer assembling itself */}
        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="glass-strong relative rounded-3xl p-4 shadow-2xl shadow-black/40 sm:p-5">
            <div className="flex items-center gap-1.5 px-1 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f2c96d]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                nexus — refund_policy.pdf, enterprise_msa.docx
              </span>
            </div>

            <div className="space-y-3 rounded-2xl bg-black/20 p-4">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/15 px-3.5 py-2.5 text-sm text-foreground">
                  {QUESTION}
                </div>
              </div>

              <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white/[0.04] px-3.5 py-3 text-[13.5px] leading-relaxed text-foreground/90 sm:text-sm">
                {TICKS.slice(0, visibleCount).map((t, idx) =>
                  t.kind === "char" ? (
                    <span key={idx}>{t.value}</span>
                  ) : (
                    <sup
                      key={idx}
                      className="mx-0.5 rounded-md bg-accent/15 px-1 py-0.5 font-mono text-[10px] font-semibold text-accent"
                    >
                      {t.value}
                    </sup>
                  )
                )}
                {!done && <span className="animate-caret text-accent">▍</span>}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {citesShown.map((source, idx) => (
                  <div
                    key={source}
                    className="animate-fade-up flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent/[0.06] px-2.5 py-1.5 font-mono text-[11px] text-accent/90"
                  >
                    <FileText className="h-3 w-3" />
                    <span>[{idx + 1}]</span>
                    <span className="text-accent/70">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Live demo — every answer traces back to a real passage, not a guess.
          </p>
        </div>
      </div>
    </section>
  );
}