/**
 * Thin wrapper over the Google Analytics 4 tag loaded in Layout.astro.
 * Safe to call anywhere: it does nothing if the tag is blocked or not loaded.
 *
 * Custom events sent by the site:
 *   copy_email           { location: 'hero' | 'footer' }
 *   lens_filter          { lens: 'all' | 'product' | 'engineering' }
 *   case_study_complete  { case_study: <slug> }
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, string> = {}) {
  try {
    window.gtag?.('event', event, params);
  } catch {
    // Analytics must never break the page.
  }
}
