import { useEffect, useState } from 'react';
import './MilitaryLoader.css';

export default function MilitaryLoader({ onComplete }: { onComplete: () => void }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Fast 1-second load
    const timer = window.setTimeout(() => {
      setOpacity(0);
      window.setTimeout(onComplete, 300);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="military-loader" style={{ opacity }}>
      <div className="loader-brand">FADSEC</div>
    </div>
  );
}