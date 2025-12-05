/**
 * Triggers a haptic vibration feedback on supported devices.
 * Uses a light vibration pattern for UI interactions.
 */
export const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10); // 10ms lightweight vibration
  }
};

/**
 * Common class names for focus states to ensure consistency and accessibility.
 */
export const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-app";
