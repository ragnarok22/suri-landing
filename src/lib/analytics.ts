import { track } from '@vercel/analytics'

type EventProperties = Record<string, string>

/**
 * Send an event to both Vercel Analytics and PostHog.
 */
export function trackEvent(event: string, properties?: EventProperties) {
  track(event, properties)
  window.posthog?.capture(event, properties)
}

/**
 * Track when a section becomes visible in the viewport (once per page load).
 * Useful for understanding how far users scroll and funnel drop-off.
 */
export function trackSectionVisibility(selector: string, sectionName: string) {
  const el = document.querySelector(selector)
  if (!el) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          trackEvent('section_viewed', { section: sectionName })
          observer.disconnect()
        }
      }
    },
    { threshold: 0.3 }
  )

  observer.observe(el)
}
