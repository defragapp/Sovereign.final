/**
 * QuietSurface (formerly GlassCard) – restrained, typography-first panel
 * conforming to UI_UX_CONTRACT.md (20-28px radius, low-contrast 1px border, no 3D tilt).
 */
export const GlassCard = ({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[#0c0c0e] p-6 transition-colors duration-200 hover:border-[rgba(255,255,255,0.14)] ${className}`}
  >
    {children}
  </div>
);
