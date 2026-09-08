export type Route =
  | '/'
  | '/app'
  | '/onboarding'
  | '/auth/redeem'
  | '/login'
  | '/signup'
  | '/how-it-works'
  | '/pricing'
  | '/faq'
  | '/terms'
  | '/privacy'
  | string;

export function currentRoute(): Route {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

export function go(path: Route): void {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}
