import React, { useRef, useState, useCallback } from 'react';

/**
 * GlassCard – high-motion glassmorphic surface with 3D mouse/gyro tilt mechanics,
 * 12-16px container radius, iridescent subtle border highlights, and 200-240ms fluid motion.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  enableTilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  tiltMaxAngle = 8,
  enableTilt = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * tiltMaxAngle;
      const rotateY = ((x - centerX) / centerX) * tiltMaxAngle;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
        '--mouse-x': `${(x / rect.width) * 100}%`,
        '--mouse-y': `${(y / rect.height) * 100}%`
      } as React.CSSProperties);
    },
    [enableTilt, tiltMaxAngle]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        transition: isHovered
          ? 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`glass-panel rounded-[16px] border border-white/10 bg-white/[0.035] p-6 shadow-2xl transition-all duration-200 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
