import { useState, useEffect } from 'react';

export function useExitIntent(): number {
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    // Minimum time on page before showing (3 seconds)
    const minTimeMs = 3000;
    const startTime = Date.now();

    const handleMouseOut = (e: MouseEvent) => {
      // Check if mouse is leaving from top of viewport (exit intent)
      // e.clientY gives Y coordinate, relatedTarget is null when leaving window
      const isLeavingTop = e.clientY <= 10;
      const isLeavingWindow = !e.relatedTarget;

      if (isLeavingTop && isLeavingWindow) {
        const timeOnPage = Date.now() - startTime;

        if (timeOnPage >= minTimeMs) {
          console.log('Exit intent detected, firing trigger');
          setTriggerCount((count) => count + 1);
        } else {
          console.log('Exit intent detected too soon, ignoring');
        }
      }
    };

    // Use mouseout instead of mouseleave for better exit intent detection
    document.documentElement.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.documentElement.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return triggerCount;
}
