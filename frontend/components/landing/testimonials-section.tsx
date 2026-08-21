const QUOTES = [
  {
    quote:
      "We deal with contracts that can't leave the building. Nexus runs entirely on our own GPU box, so legal actually lets us use it.",
    name: "Maya R.",
    role: "Data platform lead",
  },
  {
    quote:
      "The citations are the whole point. I stopped double-checking answers against the PDF because the source is already right there.",
    name: "Owen T.",
    role: "Independent researcher",
  },
  {
    quote:
      "Swapped our old cloud RAG setup for Nexus and a local Llama model. Same answer quality, zero API bill.",
    name: "Priya K.",
    role: "Support engineering manager",
  },
  {
    quote:
      "Onboarding new hires used to mean pointing them at forty pages of internal docs. Now they just ask.",
    name: "Devon L.",
    role: "Ops lead",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            From the field
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Teams keeping their documents off the cloud.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUOTES.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6">
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full font-heading text-xs font-semibold text-primary-foreground"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--accent))",
                  }}
                  aria-hidden="true"
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}