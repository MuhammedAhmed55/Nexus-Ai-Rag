const MODELS = [
  "Llama 3.1",
  "Mistral",
  "Qwen 2.5",
  "Gemma 2",
  "Phi-3",
  "DeepSeek-R1",
  "Nomic Embed",
  "mxbai-embed",
];

export function LogoMarquee() {
  const track = [...MODELS, ...MODELS];

  return (
    <section id="models" className="border-y border-border/60 py-10">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Bring your own model — anything Ollama can pull
      </p>

      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-10">
          {track.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-heading text-lg font-medium tracking-tight text-muted-foreground/70 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}