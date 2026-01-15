"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TerminalCard({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "bg-surface/70 border border-line rounded-2xl p-4 md:p-6 backdrop-blur",
        "shadow-glow",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-line/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex gap-1">
            <i className="w-2 h-2 rounded-full bg-lime/80 shadow-[0_0_8px_rgba(255,255,255,.4)]" />
            <i className="w-2 h-2 rounded-full bg-ice/80" />
            <i className="w-2 h-2 rounded-full bg-line" />
          </span>
          <h3 className="font-display text-lime tracking-wide">{title}</h3>
        </div>
        <div className="text-xs text-ice/80 font-mono">{right}</div>
      </div>
      <div className="pt-4">{children}</div>
    </motion.section>
  );
}

