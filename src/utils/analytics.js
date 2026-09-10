/**
 * Reusable analytics helper for Umami tracking.
 * Safe for SSR and resilient against adblockers or network failures.
 *
 * @param {string} eventName - Name of the custom event.
 * @param {Record<string, string | number | boolean>} [eventData] - Optional key-value properties.
 */
export const trackEvent = (eventName, eventData) => {
  try {
    if (
      typeof window !== "undefined" &&
      window.umami &&
      typeof window.umami.track === "function"
    ) {
      window.umami.track(eventName, eventData);
    }
  } catch (error) {
    // Graceful error handling: ensure tracking failure never disrupts the user experience
    if (import.meta.env?.DEV) {
      console.warn("[analytics] trackEvent failed:", error);
    }
  }
};
