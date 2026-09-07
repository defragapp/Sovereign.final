import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { Accordion, type AccordionItem } from '../Accordion';

export interface NarrativeBlock {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  accordionItems?: AccordionItem[];
  sampleCard?: {
    headerTag: string;
    headerTitle: string;
    headline: string;
    body: string;
  };
}

interface ContextScrollerProps {
  blocks: NarrativeBlock[];
}

function ScrollerBlockItem({ block, index, total }: { block: NarrativeBlock; index: number; total: number }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.94, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 1, 1, 0.4]);

  return (
    <div ref={targetRef} className="min-h-[70vh] flex flex-col justify-center py-12">
      <motion.div style={{ scale, opacity }} className="w-full">
        <GlassPanel className="p-8 sm:p-12">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-4">
              <span className="font-utility text-xs text-[var(--sage)]">{block.tag}</span>
              <h3 className="font-display text-2xl sm:text-4xl text-[var(--cream)] leading-tight">
                {block.title}
              </h3>
              <p className="font-explanation text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                <em className="text-[var(--cream)] not-italic font-medium">{block.subtitle}</em> {block.body}
              </p>
            </div>

            <div className="md:col-span-7 w-full">
              {block.accordionItems && block.accordionItems.length > 0 && (
                <Accordion items={block.accordionItems} />
              )}

              {block.sampleCard && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between text-xs font-utility text-[var(--subtle)] border-b border-white/5 pb-3">
                    <span>{block.sampleCard.headerTag}</span>
                    <span>{block.sampleCard.headerTitle}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm sm:text-base font-statement text-[var(--cream)] font-medium">
                      {block.sampleCard.headline}
                    </div>
                    <p className="font-explanation text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                      {block.sampleCard.body}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

export function ContextScroller({ blocks }: ContextScrollerProps) {
  return (
    <div className="relative space-y-8">
      {blocks.map((block, i) => (
        <ScrollerBlockItem key={block.id} block={block} index={i} total={blocks.length} />
      ))}
    </div>
  );
}
