import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * LiquidMesh – shader-like iridescent background layer combining monochrome b/w
 * foundations with fluid Siri/Gemini-style flow highlights and CSS mesh gradients.
 */
export const LiquidMesh = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.65, 0.85]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#030712",
      }}
    >
      {/* Dark Stage Spotlight base */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120vw",
          height: "75vh",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 40%, transparent 75%)",
        }}
      />

      {/* Iridescent Flow Highlight Mesh Layer */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-20%",
          rotate,
          scale,
          opacity,
          background:
            "radial-gradient(at 15% 25%, rgba(168, 85, 247, 0.08) 0px, transparent 45%), radial-gradient(at 85% 20%, rgba(59, 130, 246, 0.07) 0px, transparent 45%), radial-gradient(at 50% 80%, rgba(6, 182, 212, 0.06) 0px, transparent 50%), radial-gradient(at 75% 75%, rgba(16, 185, 129, 0.05) 0px, transparent 45%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
};
