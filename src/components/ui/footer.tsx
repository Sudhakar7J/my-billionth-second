"use client";

import { siX, siVercel, siNextdotjs, siTailwindcss } from "simple-icons";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: { path: string; title: string };
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 hover:text-primary transition-colors"
    aria-label={`Visit ${label}`}
  >
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 min-w-[14px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
    <span>{label}</span>
  </a>
);

const Divider = () => (
  <span aria-hidden="true" className="px-1">
    •
  </span>
);

const HeartIcon = () => (
  <motion.span
    className="inline-flex text-red-500 w-4 justify-center"
    animate={{ scale: [1, 1.2, 1] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    ❤️
  </motion.span>
);

const IconLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: { path: string; title: string };
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-muted-foreground/80 hover:text-primary transition-colors"
  >
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 min-w-[14px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
    {children}
  </a>
);

const FooterCredit = () => (
  <p className="text-xs text-center leading-relaxed text-muted-foreground/60 flex items-center justify-center flex-wrap gap-1.5">
    <span>Made with</span>
    <HeartIcon />
    <span>using</span>
    <IconLink href="https://nextjs.org" icon={siNextdotjs}>
      Next.js
    </IconLink>
    <span>,</span>
    <IconLink href="https://tailwindcss.com" icon={siTailwindcss}>
      Tailwind CSS
    </IconLink>
    <span>and a bit of Curiosity from</span>
    <IconLink
      href="https://twitter.com/mkbhd/status/1743123058944549056"
      icon={siX}
    >
      MKBHD&apos;s tweet
    </IconLink>
    <span>by</span>
    <a
      href="https://www.linkedin.com/in/sudhakar-j/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-muted-foreground/80 hover:text-primary transition-colors"
    >
      <Linkedin className="h-3.5 w-3.5 min-w-[14px]" />
      Sudhakar Jeeva
    </a>
  </p>
);

export function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 mt-auto border-t">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <nav className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <SocialLink
              href="https://x.com/ShadyCodes"
              icon={siX}
              label="@ShadyCodes"
            />
            <Divider />
            <SocialLink
              href="https://sudhakar-folio.vercel.app"
              icon={siVercel}
              label="Portfolio"
            />
          </nav>
          <FooterCredit />
        </div>
      </div>
    </footer>
  );
}
