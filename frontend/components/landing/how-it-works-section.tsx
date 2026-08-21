const STEPS = [
  {
    n: "01",
    title: "Upload",
    body: "Drop in PDFs, docs, or paste a URL. Nexus watches the folder — nothing leaves your machine.",
  },
  {
    n: "02",
    title: "Chunk & embed",
    body: "Text is split into passages and embedded locally with the model you've chosen in Ollama.",
  },
  {
    n: "03",
    title: "Ask",
    body: "Chat naturally, like texting a colleague who actually read the whole thing.",
  },
  {
    n: "04",
    title: "Get a cited answer",
    body: "Every claim links back to the exact passage it came from, so you can check it in one click.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            How it works
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From raw file to grounded answer, in four steps.
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden="true"
          />
          {STEPS.map((step) => (
            <div key={step.n} className="relative">
              <span className="font-heading text-sm font-semibold text-accent">
                {step.n}
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}