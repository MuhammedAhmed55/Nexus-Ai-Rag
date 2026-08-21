"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AuthService } from "@/services/auth.service";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Models", href: "#models" },
  { label: "FAQ", href: "#faq" },
];

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="url(#nexus-mark-grad)" />
      {/* Two converging strokes: retrieval + generation meeting at one point */}
      <path
        d="M9 22.5V11.8C9 10.9 10.1 10.4 10.8 11L21.5 20.2"
        stroke="#0a0c10"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.3" cy="21" r="1.9" fill="#0a0c10" />
      <defs>
        <linearGradient
          id="nexus-mark-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6c8eff" />
          <stop offset="1" stopColor="#4fd1c5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await AuthService.getUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
        <div className="glass flex h-14 items-center justify-between rounded-2xl px-3 sm:px-4">
          <a
            href="#top"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogoMark className="h-8 w-8" />
            <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
              Nexus AI
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!isLoading && (
              isAuthenticated ? (
                <a
                  href="/chat"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Sign in
                  </a>
                  <a
                    href="/register"
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
                  >
                    Get started
                  </a>
                </>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-3 md:hidden">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-foreground/90 outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              {!isLoading && (
                isAuthenticated ? (
                  <a
                    href="/chat"
                    className="flex-1 rounded-xl bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Dashboard
                  </a>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="flex-1 rounded-lg px-3 py-2 text-center text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Sign in
                    </a>
                    <a
                      href="/register"
                      className="flex-1 rounded-xl bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Get started
                    </a>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}