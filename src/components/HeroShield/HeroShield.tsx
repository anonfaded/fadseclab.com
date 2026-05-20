import flagImg from '../../assets/images/fadseclab_flag.png';
import './HeroShield.css';
import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const threats = [
  { id: 'trackers', label: 'Trackers', lane: 82, delay: '0s', color: '#ff3355', path: 'M154 86 C330 26 510 52 650 106' },
  { id: 'brokers', label: 'Data brokers', lane: 132, delay: '1.35s', color: '#ff7a30', path: 'M154 132 C334 104 506 114 652 132' },
  { id: 'spyware', label: 'Spyware', lane: 182, delay: '2.7s', color: '#ff3355', path: 'M154 178 C330 232 510 208 646 154' },
];

const shieldPath = 'M90 4 C118 12 146 18 168 30 L160 128 C154 178 126 214 90 238 C54 214 26 178 20 128 L12 30 C34 18 62 12 90 4Z';
const shieldInsetPath = 'M90 12 C114 19 137 25 155 34 L149 124 C144 166 119 198 90 220 C61 198 36 166 31 124 L25 34 C43 25 66 19 90 12Z';
const shieldCorePath = 'M90 0 C118 10 146 17 170 29 L162 130 C156 182 127 220 90 244 C53 220 24 182 18 130 L10 29 C34 17 62 10 90 0Z';
const shieldRidgePath = 'M90 12 C97 36 100 83 100 132 C100 178 96 212 90 236';

function ThreatArrow({ label, delay, color, path, id }: (typeof threats)[number]) {
  return (
    <g className="hero-threat" style={{ '--delay': delay, '--threat': color } as CSSProperties}>
      <path id={`threat-path-${id}`} className="hero-threat-path" d={path} />
      <g className="hero-arrow">
        <animateMotion dur="4.05s" begin={delay} repeatCount="indefinite" rotate="auto" keyPoints="0;0;0.78;1;1;1" keyTimes="0;0.1;0.66;0.72;0.82;1" calcMode="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.16 1 0.3 1;0.16 1 0.3 1;0.2 0 0.2 1">
          <mpath href={`#threat-path-${id}`} />
        </animateMotion>
        <line className="hero-arrow-trail" x1="-48" y1="0" x2="-14" y2="0" />
        <line className="hero-arrow-shaft" x1="-16" y1="0" x2="24" y2="0" />
        <path className="hero-arrow-head" d="M24 -7 39 0 24 7Z" />
        <path className="hero-arrow-fin" d="M-16 0 -29 -8 -23 0 -29 8Z" />
        <text className="hero-arrow-label" x="-12" y="-13">{label}</text>
      </g>
    </g>
  );
}

function ShockBurst({ className, delay }: { className: string; delay: string }) {
  return (
    <g className={className} style={{ '--delay': delay } as CSSProperties}>
      <path className="hero-shockfield-web" d="M650 132 C662 118 686 118 700 132 C686 148 662 148 650 132Z" />
      <path className="hero-shockfield-web hero-shockfield-web--secondary" d="M668 132 L642 118 M668 132 L644 152 M668 132 L694 110 M668 132 L704 150" />
      <path className="hero-shockfield-bolt" d="M650 126 L668 132 L654 144 L676 136" />
      <path className="hero-shockfield-bolt" d="M668 132 L688 124 L680 138 L706 134" />
      <circle className="hero-shockfield-node" cx="668" cy="132" r="3" />
    </g>
  );
}

function HeldShield() {
  return (
    <g className="hero-shield-hit hero-shield-hit--one">
      <g className="hero-shield-hit hero-shield-hit--two">
        <g className="hero-shield-hit hero-shield-hit--three">
          <g transform="translate(568 78) rotate(10 92 120) scale(0.72)">
            <g className="hero-shield-rig">
              <circle className="hero-shield-halo hero-shield-halo--outer" cx="92" cy="118" r="102" />
              <circle className="hero-shield-halo hero-shield-halo--inner" cx="92" cy="118" r="76" />
              <path className="hero-shield-shadow" d="M92 206 C128 206 160 216 160 228 C160 242 128 252 92 252 C56 252 24 242 24 228 C24 216 56 206 92 206Z" />
              <g className="hero-shield-body">
                <path className="hero-shield-side" d={shieldPath} transform="translate(8 8)" />
                <path className="hero-shield-depth" d={shieldInsetPath} />
                <path className="hero-shield-face" d={shieldCorePath} />
                <path className="hero-shield-highlight" d="M52 30 C64 18 78 12 92 12 C82 42 78 80 78 124 C78 166 82 198 90 222 C70 210 56 192 46 166 C38 142 34 110 34 86 C34 62 40 42 52 30Z" />
                <path className="hero-shield-ridge" d={shieldRidgePath} />
                <g className="hero-shield-wire" clipPath="url(#hero-shield-clip)">
                  <path d="M30 58 C58 70 102 72 142 60" />
                  <path d="M24 112 C60 126 104 126 152 110" />
                  <path d="M44 166 C70 176 108 176 134 166" />
                  <path d="M58 30 C62 78 66 142 92 236" />
                  <path d="M130 30 C124 78 118 142 92 236" />
                </g>
                <path className="hero-shield-core" d={shieldCorePath} />
                <path className="hero-shield-rim" d={shieldCorePath} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

export default function HeroShield() {
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);

  const updateEyeState = useCallback((targetX: number, targetY: number) => {
    [
      { ref: leftEyeRef, origin: { x: 762, y: 48 } },
      { ref: rightEyeRef, origin: { x: 786, y: 47 } },
    ].forEach(({ ref, origin }) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(targetY - centerY, targetX - centerX);
      const distance = Math.min(3.4, Math.hypot(targetX - centerX, targetY - centerY) / 32);

      ref.current.setAttribute('cx', String(origin.x + Math.cos(angle) * distance));
      ref.current.setAttribute('cy', String(origin.y + Math.sin(angle) * distance));
    });
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let nextX = window.innerWidth / 2;
    let nextY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        updateEyeState(nextX, nextY);
        animationFrame = 0;
      });
    };

    updateEyeState(window.innerWidth / 2, window.innerHeight / 2);
    if (!window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateEyeState]);

  return (
    <div className="hero-defense" aria-label="FadSec Lab blocks trackers, spyware, and data brokers before they reach users">
      <svg className="hero-defense-svg" viewBox="0 0 900 300" role="img" focusable="false">
        <defs>
          <radialGradient id="hero-guardian-head" cx="34%" cy="26%" r="70%">
            <stop offset="0%" stopColor="rgba(33,35,45,1)" />
            <stop offset="46%" stopColor="rgba(22,24,32,1)" />
            <stop offset="100%" stopColor="rgba(7,7,10,1)" />
          </radialGradient>
          <linearGradient id="hero-guardian-body" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(25,27,36,1)" />
            <stop offset="48%" stopColor="rgba(18,20,28,1)" />
            <stop offset="100%" stopColor="rgba(7,7,10,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-face-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,132,146,0.96)" />
            <stop offset="34%" stopColor="rgba(225,45,68,0.96)" />
            <stop offset="76%" stopColor="rgba(118,13,31,0.98)" />
            <stop offset="100%" stopColor="rgba(42,5,14,0.98)" />
          </linearGradient>
          <linearGradient id="hero-shield-side-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(77,10,22,0.95)" />
            <stop offset="100%" stopColor="rgba(30,4,10,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-highlight-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.56)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="hero-shield-core" cx="42%" cy="35%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="48%" stopColor="rgba(232,51,74,0.22)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </radialGradient>
          <linearGradient id="hero-floor" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(232,51,74,0.08)" />
            <stop offset="52%" stopColor="rgba(232,51,74,0.16)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </linearGradient>
          <clipPath id="hero-shield-clip">
            <path d={shieldCorePath} />
          </clipPath>
        </defs>

        <ellipse className="hero-defense-floor" cx="520" cy="254" rx="350" ry="24" />

        {threats.map((threat) => (
          <ThreatArrow key={threat.id} {...threat} />
        ))}

        <g className="hero-guardian">
          <ellipse className="hero-guardian-shadow" cx="760" cy="260" rx="118" ry="20" />
          <path className="hero-guardian-leg hero-guardian-leg--back" d="M768 188 L730 216 L704 254" />
          <path className="hero-guardian-leg hero-guardian-leg--front" d="M768 188 L816 220 L846 254" />
          <g className="hero-guardian-upper">
            <path className="hero-guardian-body" d="M781 130 C776 150 772 170 768 190" />
            <path className="hero-guardian-arm hero-guardian-arm--shield" d="M768 128 C736 136 702 152 666 170" />
            <path className="hero-guardian-hand hero-guardian-hand--shield" d="M658 170 C666 162 678 164 682 174 C678 184 666 188 658 182 C656 178 656 174 658 170Z" />
            <HeldShield />
            <path className="hero-guardian-arm hero-guardian-arm--flag" d="M790 128 C820 134 848 118 872 94" />
            <image className="hero-held-flag" href={flagImg} x="770" y="-8" width="150" height="112" preserveAspectRatio="xMidYMid meet" />
            <g className="hero-guardian-headgroup" transform="translate(0 12)">
              <circle className="hero-guardian-head" cx="782" cy="50" r="42" />
              <path className="hero-guardian-head-ring" d="M742 50 C742 24 762 8 782 8 C804 8 822 24 822 50 C822 76 804 92 782 92 C762 92 742 76 742 50Z" />
              <path className="hero-guardian-brow" d="M754 35 L771 41 M779 40 L799 34" />
              <g className="hero-guardian-eyes">
                <path className="hero-eye-socket hero-eye-socket--near" d="M754 43 H772 C772 57 754 57 754 43Z" />
                <path className="hero-eye-socket hero-eye-socket--far" d="M780 42 H798 C798 55 780 55 780 42Z" />
                <circle ref={leftEyeRef} className="hero-eyeball" cx="762" cy="48" r="4.2" />
                <circle ref={rightEyeRef} className="hero-eyeball" cx="786" cy="47" r="3.6" />
              </g>
            </g>
            <path className="hero-guardian-hand hero-guardian-hand--flag" d="M872 78 C882 68 896 72 898 84 C894 96 880 100 870 92 C868 88 868 82 872 78Z" />
          </g>
        </g>

        <ShockBurst className="hero-shield-hit hero-shield-hit--one hero-shockfield hero-shockfield--one" delay="0s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--two hero-shockfield hero-shockfield--two" delay="1.35s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--three hero-shockfield hero-shockfield--three" delay="2.7s" />
      </svg>
    </div>
  );
}
