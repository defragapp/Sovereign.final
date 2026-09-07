import { motion } from 'framer-motion';

export function AmbientMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* Primary white/cream ambient mesh orb */}
      <motion.div
        className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0.005)_50%,transparent_70%)] blur-[100px]"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.08, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Secondary muted sage ambient mesh orb */}
      <motion.div
        className="absolute top-[35%] right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(174,186,167,0.03)_0%,transparent_65%)] blur-[120px]"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.12, 1],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Tertiary depth mesh orb */}
      <motion.div
        className="absolute bottom-[-10%] left-[30%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[110px]"
        animate={{
          rotate: [0, 360],
          scale: [1.05, 0.95, 1.05]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}
