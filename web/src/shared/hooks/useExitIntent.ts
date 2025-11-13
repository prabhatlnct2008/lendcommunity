import { useState, useEffect } from 'react';

export function useExitIntent(): boolean {
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('exit_intent_shown');
    if (hasShown) {
      return;
    }

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
        console.log('Exit intent detected!', {
          clientY: e.clientY,
          timeOnPage,
          minTime: minTimeMs,
          relatedTarget: e.relatedTarget,
        });

        if (timeOnPage >= minTimeMs) {
          console.log('Showing exit intent modal');
          setShowExitIntent(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
          document.removeEventListener('mouseout', handleMouseOut);
        } else {
          console.log('Not enough time on page yet');
        }
      }
    };

    // Use mouseout instead of mouseleave for better exit intent detection
    document.documentElement.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.documentElement.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return showExitIntent;
}
