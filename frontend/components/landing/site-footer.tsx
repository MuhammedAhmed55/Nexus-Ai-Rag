import { GiftIcon } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Overview", "Models", "How it works", "Changelog"] },
  { title: "Resources", links: ["Docs", "Ollama setup guide", "API reference"] },
  { title: "Company", links: ["About", "Privacy", "Terms"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-heading text-base font-semibold tracking-tight text-foreground">
              Nexus AI
            </span>
            <p className="mt-3 max-w-[20ch] text-sm text-muted-foreground">
              Ask your documents anything — privately.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <GiftIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Nexus AI. All rights reserved.</span>
          <span>Built for local-first retrieval, powered by Ollama.</span>
        </div>
      </div>
    </footer>
  );
}