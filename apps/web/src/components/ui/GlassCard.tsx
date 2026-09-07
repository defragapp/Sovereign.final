import { motion } from 'framer-motion';

/**
 * GlassCard – a translucent frosted glass panel with subtle tilt on hover.
 * Use by wrapping any content: <GlassCard>{children}</GlassCard>
 */
export const GlassCard = ({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    whileHover={{ rotateX: 2, rotateY: 2, scale: 1.02, transition: { duration: 0.2 } }}
    className={`rounded-2xl border border-white/10 bg-background/60 p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);
