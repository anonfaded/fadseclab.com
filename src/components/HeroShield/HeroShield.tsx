import './HeroShield.css';

const threats = [
  { id: 'trackers', label: 'Trackers', lane: 82, delay: '0s', color: '#ff3355', path: 'M154 86 C330 26 510 52 650 106' },
  { id: 'brokers', label: 'Data brokers', lane: 132, delay: '1.35s', color: '#ff7a30', path: 'M154 132 C334 104 506 114 652 132' },
  { id: 'spyware', label: 'Spyware', lane: 182, delay: '2.7s', color: '#ff3355', path: 'M154 178 C330 232 510 208 646 154' },
];

function ThreatArrow({ label, lane, delay, color, path, id }: (typeof threats)[number]) {
  return (
    <g className="hero-threat" style={{ '--delay': delay, '--threat': color } as React.CSSProperties}>
      <path id={`threat-path-${id}`} className="hero-threat-path" d={path} />
      <g className="hero-arrow">
        <animateMotion dur="4.05s" begin={delay} repeatCount="indefinite" rotate="auto" keyPoints="0;0;0.76;0.91;1;1" keyTimes="0;0.12;0.62;0.72;0.78;1" calcMode="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.16 1 0.3 1;0.16 1 0.3 1;0.2 0 0.2 1">
          <mpath href={`#threat-path-${id}`} />
        </animateMotion>
        <line className="hero-arrow-trail" x1="-48" y1="0" x2="-14" y2="0" />
        <line className="hero-arrow-shaft" x1="-16" y1="0" x2="24" y2="0" />
        <path className="hero-arrow-head" d="M24 -7 39 0 24 7Z" />
        <path className="hero-arrow-fin" d="M-16 0 -29 -8 -23 0 -29 8Z" />
        <text className="hero-arrow-label" x="-12" y="-13">{label}</text>
      </g>
      <g className="hero-queued-arrow" transform={`translate(110 ${lane})`}>
        <line x1="-36" y1="0" x2="18" y2="0" />
        <path d="M18 -5 28 0 18 5Z" />
      </g>
    </g>
  );
}

export default function HeroShield() {
  return (
    <div className="hero-defense" aria-label="FadSec Lab blocks trackers, spyware, and data brokers before they reach users">
      <svg className="hero-defense-svg" viewBox="0 0 900 300" role="img" focusable="false">
        <defs>
          <linearGradient id="hero-floor" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(232,51,74,0.08)" />
            <stop offset="52%" stopColor="rgba(232,51,74,0.16)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </linearGradient>
          <linearGradient id="hero-shield-face" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,116,137,0.92)" />
            <stop offset="52%" stopColor="rgba(190,28,54,0.78)" />
            <stop offset="100%" stopColor="rgba(58,8,18,0.86)" />
          </linearGradient>
          <radialGradient id="hero-shield-core" cx="42%" cy="35%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
            <stop offset="48%" stopColor="rgba(232,51,74,0.16)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </radialGradient>
          <filter id="hero-shield-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse className="hero-defense-floor" cx="470" cy="248" rx="380" ry="28" />

        <g className="hero-launcher" transform="translate(44 74)">
          <path className="hero-launcher-top" d="M0 112 142 86 184 104 42 132Z" />
          <path className="hero-launcher-front" d="M42 132 184 104 184 132 42 160Z" />
          <path className="hero-launcher-side" d="M0 112 42 132 42 160 0 139Z" />
          <path className="hero-launcher-leg" d="M42 154 54 154 46 198 34 198Z" />
          <path className="hero-launcher-leg" d="M164 130 176 128 184 172 172 174Z" />
          <text className="hero-launcher-title" x="22" y="78">incoming threats</text>
        </g>

        {threats.map((threat) => (
          <ThreatArrow key={threat.id} {...threat} />
        ))}

        <g className="hero-impact hero-impact--one">
          <circle cx="650" cy="106" r="3" />
          <path d="M650 106 l-17 -12 M650 106 l-20 6 M650 106 l-8 20" />
        </g>
        <g className="hero-impact hero-impact--two">
          <circle cx="652" cy="132" r="3" />
          <path d="M652 132 l-18 -2 M652 132 l-13 14 M652 132 l-10 -17" />
        </g>
        <g className="hero-impact hero-impact--three">
          <circle cx="646" cy="154" r="3" />
          <path d="M646 154 l-16 10 M646 154 l-21 -5 M646 154 l-7 -19" />
        </g>

        <g className="hero-shield-hit hero-shield-hit--one">
          <g className="hero-shield-hit hero-shield-hit--two">
            <g className="hero-shield-hit hero-shield-hit--three">
              <g transform="translate(668 42)">
                <g className="hero-shield-rig">
                  <path className="hero-shield-shadow" d="M90 198 C126 198 155 208 155 220 C155 232 126 242 90 242 C54 242 25 232 25 220 C25 208 54 198 90 198Z" />
                  <g className="hero-shield-body">
                    <path className="hero-shield-depth" d="M90 10 C118 22 147 28 164 35 L154 136 C148 180 122 210 90 226 C58 210 32 180 26 136 L16 35 C33 28 62 22 90 10Z" />
                    <path className="hero-shield-face" d="M90 0 C118 12 147 18 164 25 L154 126 C148 170 122 200 90 216 C58 200 32 170 26 126 L16 25 C33 18 62 12 90 0Z" />
                    <path className="hero-shield-core" d="M90 0 C118 12 147 18 164 25 L154 126 C148 170 122 200 90 216 C58 200 32 170 26 126 L16 25 C33 18 62 12 90 0Z" />
                    <path className="hero-shield-rim" d="M90 0 C118 12 147 18 164 25 L154 126 C148 170 122 200 90 216 C58 200 32 170 26 126 L16 25 C33 18 62 12 90 0Z" />
                    <text className="hero-shield-mark" x="90" y="112">FSL</text>
                    <text className="hero-shield-caption" x="90" y="134">privacy wall</text>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
