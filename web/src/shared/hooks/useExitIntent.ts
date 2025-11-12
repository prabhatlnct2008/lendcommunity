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

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from top of viewport
      if (e.clientY <= 0) {
        const timeOnPage = Date.now() - startTime;
        if (timeOnPage >= minTimeMs) {
          setShowExitIntent(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return showExitIntent;
}
