import { useEffect, useState } from 'react';
import './MilitaryLoader.css';

export default function MilitaryLoader({ onComplete }: { onComplete: () => void }) {
  const [opacity, setOpacity] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = window.setInterval(() => {
      currentProgress += Math.random() * 12;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setLoaded(true);
      }
      setProgress(currentProgress);
    }, 60);

    // Timeout fallback
    const timer = window.setTimeout(() => {
      setProgress(100);
      setLoaded(true);
    }, 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    setOpacity(0);
    // Fade out quickly, then start animations
    const timer = window.setTimeout(onComplete, 200);

    return () => window.clearTimeout(timer);
  }, [loaded, onComplete]);

  return (
    <div className="military-loader" style={{ opacity }}>
      <div className="loader-brand">FADSEC LAB</div>
      <div className="loader-progress">
        <div className="loader-progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}