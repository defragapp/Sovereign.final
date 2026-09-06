/**
 * Shared Sovereign contracts live here during extraction from OPENAPI.
 * Keep this package intentionally small and transport/framework agnostic.
 */
export type SovereignPlan = 'free' | 'sovereign_plus';

export type ApiError = {
  error?: string;
  message?: string;
  retryable?: boolean;
  nextAction?: string;
};
