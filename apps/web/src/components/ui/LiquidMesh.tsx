import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * LiquidMesh – a background layer that shifts its gradient colors based on scroll position.
 * It spans the full viewport height and sits behind the main content (z-index: -1).
 */
export const LiquidMesh = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  // Gradient rotation from 0deg to 360deg as user scrolls.
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  // Background color transitions.
  const bg = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["hsl(220, 30%, 5%)", "hsl(210, 25%, 7%)", "hsl(200, 20%, 5%)"]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        rotate,
        background: bg,
      }}
    />
  );
};
