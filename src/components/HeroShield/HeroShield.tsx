import flagImg from '../../assets/images/fadseclab_flag.png';
import './HeroShield.css';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, RefObject } from 'react';

// All arrows fire from the single tower launcher muzzle (scaled tower: muzzle now at 236,71).
const threats = [
  { id: 'trackers', label: 'Trackers', lane: 82, delay: '0s', color: '#ff5a45', path: 'M236 71 C378 43 560 71 700 115' },
  { id: 'brokers', label: 'Data brokers', lane: 132, delay: '1.35s', color: '#ff3f35', path: 'M236 71 C382 87 565 123 702 141' },
  { id: 'spyware', label: 'Spyware', lane: 182, delay: '2.7s', color: '#ff7264', path: 'M236 71 C368 137 544 197 696 163' },
];

const shieldPath = 'M90 4 C118 12 146 18 168 30 L160 128 C154 178 126 214 90 238 C54 214 26 178 20 128 L12 30 C34 18 62 12 90 4Z';
const shieldInsetPath = 'M90 12 C114 19 137 25 155 34 L149 124 C144 166 119 198 90 220 C61 198 36 166 31 124 L25 34 C43 25 66 19 90 12Z';
const shieldCorePath = 'M90 0 C118 10 146 17 170 29 L162 130 C156 182 127 220 90 244 C53 220 24 182 18 130 L10 29 C34 17 62 10 90 0Z';
const guardianBodyBase = 'M781 147 Q777 155 768 190'; // Curved top for smooth shoulder joint
const guardianBodyHit = guardianBodyBase;
const guardianShieldShoulder = { x: 780, y: 143 }; // Aligned with flag arm
const guardianShieldElbowBase = { x: 744, y: 166 };
const guardianShieldElbowHit = { x: 752, y: 168 }; // Elbow nudges right + slightly down on impact — upper arm rotates subtly
const guardianShieldHandBase = { x: 706, y: 176 };
const guardianShieldHandHit = { x: 722, y: 176 }; // Hand recoils RIGHT only — pure horizontal, same Y = no up/down
const guardianBackHip = { x: 768, y: 188 };
const guardianBackKneeBase = { x: 726, y: 216 }; // Centered midpoint + forward offset → equal upper/lower segments ≈50 each
const guardianBackKneeHit = guardianBackKneeBase;
const guardianBackFootBase = { x: 710, y: 258 };
const guardianFrontHip = { x: 768, y: 188 };
const guardianFrontKneeBase = { x: 790, y: 224 }; // Test: bend more toward left/shield side
const guardianFrontKneeHit = guardianFrontKneeBase;
const guardianFrontFootBase = { x: 830, y: 254 }; // Lower leg points left/inward like the back leg



function interpolatePath(base: string, target: string, amount: number) {
  const targetNumbers = target.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let index = 0;

  return base.replace(/-?\d+(?:\.\d+)?/g, (value) => {
    const start = Number(value);
    const end = targetNumbers[index++] ?? start;
    const next = start + (end - start) * amount;
    return Number(next.toFixed(2)).toString();
  });
}

function interpolatePoint(base: { x: number; y: number }, target: { x: number; y: number }, amount: number) {
  return {
    x: base.x + (target.x - base.x) * amount,
    y: base.y + (target.y - base.y) * amount,
  };
}

function pathBetween(start: { x: number; y: number }, end: { x: number; y: number }) {
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} L${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

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

function MeshTower() {
  const rings = [
    { y: 82, l: 38, r: 64 },
    { y: 118, l: 31, r: 70 },
    { y: 158, l: 23, r: 77 },
    { y: 199, l: 15, r: 84 },
    { y: 232, l: 8, r: 91 },
  ];

  return (
    <g className="hero-ad-tower" transform="translate(135 15) scale(0.9)">
      <ellipse className="hero-ad-shadow" cx="49" cy="239" rx="58" ry="10" />
      <polygon className="hero-ad-tower-side-fill" points="64,82 76,76 102,225 91,232" />
      <polygon className="hero-ad-tower-fill" points="38,82 64,82 91,232 8,232" />
      <polygon className="hero-ad-tower-top-cap" points="38,82 64,82 76,76 49,76" />
      {rings.map((ring) => (
        <g key={ring.y}>
          <line className="hero-ad-tower-ring" x1={ring.l} y1={ring.y} x2={ring.r} y2={ring.y} />
          <line className="hero-ad-tower-side-ring" x1={ring.r} y1={ring.y} x2={ring.r + 9} y2={ring.y - 5} />
        </g>
      ))}
      <line className="hero-ad-tower-leg hero-ad-tower-leg--edge" x1="38" y1="82" x2="8" y2="232" />
      <line className="hero-ad-tower-leg hero-ad-tower-leg--edge" x1="64" y1="82" x2="91" y2="232" />
      <line className="hero-ad-tower-leg hero-ad-tower-leg--rear" x1="76" y1="76" x2="102" y2="225" />
      <line className="hero-ad-tower-leg" x1="46" y1="85" x2="29" y2="232" />
      <line className="hero-ad-tower-leg" x1="57" y1="85" x2="73" y2="232" />
      {rings.slice(0, -1).map((top, index) => {
        const bottom = rings[index + 1];
        return (
          <g key={`tower-brace-${top.y}`}>
            <line className="hero-ad-tower-brace" x1={top.l} y1={top.y} x2={bottom.r} y2={bottom.y} />
            <line className="hero-ad-tower-brace" x1={top.r} y1={top.y} x2={bottom.l} y2={bottom.y} />
          </g>
        );
      })}
      <line className="hero-ad-tower-foot" x1="8" y1="232" x2="-8" y2="242" />
      <line className="hero-ad-tower-foot" x1="8" y1="232" x2="27" y2="243" />
      <line className="hero-ad-tower-foot" x1="91" y1="232" x2="69" y2="243" />
      <line className="hero-ad-tower-foot" x1="91" y1="232" x2="108" y2="241" />
      <ellipse className="hero-ad-tower-pad" cx="-8" cy="242" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="27" cy="243" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="69" cy="243" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="108" cy="241" rx="5" ry="1.8" />

      <g className="hero-ad-launcher">
        <ellipse className="hero-ad-launcher-ring" cx="52" cy="82" rx="34" ry="8.2" />
        <polygon className="hero-ad-launcher-top" points="27,74 74,74 88,64 42,64" />
        <polygon className="hero-ad-launcher-face" points="32,74 74,74 69,54 38,54" />
        <polygon className="hero-ad-launcher-side" points="74,74 88,64 82,47 69,54" />
        <path className="hero-ad-launcher-detail" d="M41 60 H65 M39 66 H69" />
        <path className="hero-ad-barrel" d="M72 62 L89 58 H112 V67 H89 Z" />
        <ellipse className="hero-ad-muzzle" cx="112" cy="62" rx="3.2" ry="5.2" />
      </g>

      {threats.map((t) => (
        <ellipse key={t.id} className="hero-muzzle-flash"
          cx="112" cy="62" rx="15" ry="8"
          style={{ '--pod-delay': t.delay, '--threat': t.color } as CSSProperties}
        />
      ))}

      <line className="hero-ad-antenna" x1="52" y1="54" x2="52" y2="32" />
      <path className="hero-ad-antenna-cross" d="M42 43 H62 M46 38 H58" />
      <circle className="hero-antenna-tip-dot" cx="52" cy="32" r="2.2" />
    </g>
  );
}

// Shared fence helpers — used by both FenceUpperWall and FenceFrontWall
type FencePost = { foot: { x: number; y: number }; top: { x: number; y: number }; w: number };
const MESH_STEPS = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84];
const MID_HEIGHTS = [0.28, 0.56];

function renderFenceMesh(posts: FencePost[]) {
  const topStart = posts[0].top, topEnd = posts[posts.length - 1].top;
  const bottomStart = posts[0].foot, bottomEnd = posts[posts.length - 1].foot;
  return MESH_STEPS.map((step) => {
    const tA = interpolatePoint(topStart, topEnd, step);
    const bB = interpolatePoint(bottomStart, bottomEnd, Math.min(step + 0.08, 1));
    const bA = interpolatePoint(bottomStart, bottomEnd, step);
    const tB = interpolatePoint(topStart, topEnd, Math.min(step + 0.08, 1));
    return (
      <g key={`m${step}`}>
        <line className="hero-ad-fence-mesh-line" x1={tA.x} y1={tA.y} x2={bB.x} y2={bB.y} />
        <line className="hero-ad-fence-mesh-line hero-ad-fence-mesh-line--back" x1={bA.x} y1={bA.y} x2={tB.x} y2={tB.y} />
      </g>
    );
  });
}

function renderFencePosts(posts: FencePost[]) {
  return posts.map((post) => (
    <g key={`p${post.foot.x}-${post.foot.y}`}>
      <ellipse className="hero-ad-fence-foot" cx={post.foot.x + post.w * 0.5} cy={post.foot.y + 3} rx={post.w * 1.65} ry={post.w * 0.5} />
      <polygon className="hero-ad-fence-cap" points={`${post.top.x - 2},${post.top.y + 1} ${post.top.x + post.w + 2},${post.top.y - 2} ${post.top.x + post.w + 6},${post.top.y - 7} ${post.top.x + 2},${post.top.y - 4}`} />
      <polygon className="hero-ad-fence-post" points={`${post.foot.x},${post.foot.y} ${post.foot.x + post.w},${post.foot.y - 1.8} ${post.top.x + post.w},${post.top.y - 2.4} ${post.top.x},${post.top.y}`} />
      <polygon className="hero-ad-fence-post-side" points={`${post.foot.x + post.w},${post.foot.y - 1.8} ${post.foot.x + post.w + 4},${post.foot.y - 5} ${post.top.x + post.w + 4},${post.top.y - 6} ${post.top.x + post.w},${post.top.y - 2.4}`} />
    </g>
  ));
}

function renderFenceSegment(posts: FencePost[], keyPrefix: string) {
  const rail = (sel: 'top' | 'foot') =>
    posts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[sel].x} ${p[sel].y}`).join(' ');
  const midRail = (h: number) =>
    posts.map((p, i) => {
      const m = interpolatePoint(p.top, p.foot, h);
      return `${i === 0 ? 'M' : 'L'}${m.x.toFixed(1)} ${m.y.toFixed(1)}`;
    }).join(' ');
  return (
    <>
      {renderFenceMesh(posts)}
      <path className="hero-ad-fence-rail hero-ad-fence-rail--top" d={rail('top')} />
      {MID_HEIGHTS.map((h) => <path key={`${keyPrefix}-mid-${h}`} className="hero-ad-fence-rail hero-ad-fence-rail--mid" d={midRail(h)} />)}
      <path className="hero-ad-fence-rail" d={rail('foot')} />
      {renderFencePosts(posts)}
    </>
  );
}

function TerritoryFloor() {
  // Curved compound slab: right wall turns into a back run, then closes into the front fence.
  return (
    <g className="hero-territory-floor">
      <path
        className="hero-territory-floor-slab"
        d="M286 88 C198 112 82 146 -55 190 C-142 215 -220 270 -294 323 L224 295 L224 268 Z"
      />
      <polygon className="hero-territory-floor-front"
        points="224,295 -350,325 -350,337 224,308"
      />
      <path className="hero-territory-horizon-fade" d="M286 88 C198 112 82 146 -55 190 C-142 215 -220 270 -294 323 L-294 296 C-214 245 -138 205 -55 180 C78 141 197 108 286 88Z" />
    </g>
  );
}

function FenceUpperWall() {
  const mainPosts: FencePost[] = [
    { foot: { x: 224, y: 268 }, top: { x: 224, y: 196 }, w: 8 },
    { foot: { x: 242, y: 214 }, top: { x: 242, y: 157 }, w: 7 },
    { foot: { x: 263, y: 150 }, top: { x: 263, y: 105 }, w: 6 },
    { foot: { x: 286, y: 88 }, top: { x: 286, y: 51 }, w: 5 },
  ];
  const returnPosts: FencePost[] = [
    { foot: { x: 286, y: 88 }, top: { x: 286, y: 51 }, w: 5 },
    { foot: { x: 248, y: 99 }, top: { x: 248, y: 62 }, w: 5 },
    { foot: { x: 205, y: 112 }, top: { x: 205, y: 75 }, w: 5 },
    { foot: { x: 155, y: 128 }, top: { x: 155, y: 91 }, w: 4 },
    { foot: { x: 95, y: 146 }, top: { x: 95, y: 111 }, w: 4 },
    { foot: { x: 25, y: 166 }, top: { x: 25, y: 132 }, w: 3 },
    { foot: { x: -55, y: 190 }, top: { x: -55, y: 154 }, w: 3 },
  ];
  const cornerPosts: FencePost[] = [
    { foot: { x: -55, y: 190 }, top: { x: -55, y: 154 }, w: 3 },
    { foot: { x: -112, y: 213 }, top: { x: -112, y: 176 }, w: 3 },
    { foot: { x: -165, y: 244 }, top: { x: -165, y: 207 }, w: 3 },
    { foot: { x: -220, y: 283 }, top: { x: -220, y: 238 }, w: 3 },
    { foot: { x: -294, y: 323 }, top: { x: -294, y: 276 }, w: 3 },
  ];
  return (
    <g className="hero-ad-fence">
      <g className="hero-ad-fence-main">
        {renderFenceSegment(mainPosts, 'upper')}
      </g>
      <g className="hero-ad-fence-return">
        {renderFenceSegment(returnPosts, 'upper-return')}
        <path className="hero-ad-fence-return-rail" d="M286 51 C205 70 111 100 -55 154" />
        <path className="hero-ad-fence-return-rail hero-ad-fence-return-rail--low" d="M286 88 C205 113 108 146 -55 190" />
      </g>
      <g className="hero-ad-fence-corner">
        {renderFenceSegment(cornerPosts, 'upper-corner')}
        <path className="hero-ad-fence-return-rail" d="M-55 154 C-118 174 -178 216 -294 276" />
        <path className="hero-ad-fence-return-rail hero-ad-fence-return-rail--low" d="M-55 190 C-128 216 -202 282 -294 323" />
      </g>
      <path className="hero-ad-fence-vapor" d="M286 88 C198 112 82 146 -55 190 C-142 215 -220 270 -294 323" />
      <g className="hero-fence-electric" aria-hidden="true">
        <path className="hero-fence-bolt hero-fence-bolt--a" d="M241 151 L247 144 L246 153 L254 148" />
        <path className="hero-fence-bolt hero-fence-bolt--b" d="M263 99 L269 92 L268 101 L276 96" />
        <path className="hero-fence-bolt hero-fence-bolt--c" d="M279 65 L285 58 L284 67 L292 62" />
      </g>
    </g>
  );
}

function FenceFrontWall() {
  // Front/bottom wall — runs from corner (x=224) left to viewport edge (x≈-294)
  // Rendered AFTER generator so it appears visually in front of it (correct isometric depth)
  const posts: FencePost[] = [
    { foot: { x: 224, y: 295 }, top: { x: 224, y: 248 }, w: 8 },
    { foot: { x: 187, y: 300 }, top: { x: 187, y: 253 }, w: 8 },
    { foot: { x: 150, y: 304 }, top: { x: 150, y: 257 }, w: 7 },
    { foot: { x: 113, y: 307 }, top: { x: 113, y: 260 }, w: 7 },
    { foot: { x: 76, y: 310 }, top: { x: 76, y: 263 }, w: 7 },
    { foot: { x: 39, y: 312 }, top: { x: 39, y: 265 }, w: 6 },
    { foot: { x: 2, y: 314 }, top: { x: 2, y: 267 }, w: 6 },
    { foot: { x: -35, y: 316 }, top: { x: -35, y: 269 }, w: 6 },
    { foot: { x: -72, y: 317 }, top: { x: -72, y: 270 }, w: 5 },
    { foot: { x: -109, y: 318 }, top: { x: -109, y: 271 }, w: 5 },
    { foot: { x: -146, y: 319 }, top: { x: -146, y: 272 }, w: 5 },
    { foot: { x: -183, y: 320 }, top: { x: -183, y: 273 }, w: 4 },
    { foot: { x: -220, y: 321 }, top: { x: -220, y: 274 }, w: 4 },
    { foot: { x: -257, y: 322 }, top: { x: -257, y: 275 }, w: 4 },
    { foot: { x: -294, y: 323 }, top: { x: -294, y: 276 }, w: 3 },
  ];
  return (
    <g className="hero-ad-fence">
      {renderFenceSegment(posts, 'front')}
    </g>
  );
}

function PowerCables() {
  // Cable travels ground level, then spirals around left tower leg as it climbs
  // Left leg: base ~(169, 186), top ~(157, 78), center x changes from 169→157
  // Spiral wraps around the leg with lateral motion (left-right oscillation around leg)
  const cable = `
    M60,265
    L140,265
    C150,265 158,264 163,258
    C168,200 172,175 167,150
    C162,135 157,120 158,100
    C159,88 160,78 160,78
    C159,95 160,110 161,130
    C162,150 165,170 169,185
    C167,210 150,260 90,265
  `;

  return (
    <g className="hero-power-cables" aria-hidden="true">
      <path className="hero-power-cable-shadow" d={cable} />
      <path className="hero-power-cable hero-power-cable--tower" d={cable} />
      <path className="hero-power-pulse hero-power-pulse--tower" d={cable} />
    </g>
  );
}

function StageFloor() {
  return (
    <g className="hero-stage-floor">
      <ellipse className="hero-fence-island-shadow" cx="260" cy="242" rx="76" ry="18" />
      <polygon className="hero-stage-floor-slab" points="214,272 230,198 286,58 320,73 272,286" />
      <polygon className="hero-fence-island-side" points="214,272 272,286 320,73 318,87 274,296 212,281" />
      <path className="hero-floor-seam" d="M226 258 L244 202 L288 83 M246 278 L264 210 L305 86" />
      <path className="hero-floor-seam hero-floor-seam--cross" d="M224 222 L306 87 M218 248 L292 145 M214 272 L274 286" />
      <path className="hero-fence-island-fade" d="M278 73 C306 82 323 101 330 130 C315 105 300 93 278 88 Z" />
    </g>
  );
}

function PowerGenerator() {
  const s = 1.5;  // Scale factor
  const offsX = -120, offsY = -110;  // Positioned deeper in compound so top peeks above front fence
  const SDX = 14 * s, SDY = -9 * s;

  return (
    <g className="hero-generator" transform={`translate(${offsX} ${offsY})`}>
      <g className="hero-generator-smoke" aria-hidden="true">
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--a" cx={166*s} cy={200*s} rx={6.2*s} ry={3.3*s} />
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--b" cx={174*s} cy={190*s} rx={8.1*s} ry={4.5*s} />
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--c" cx={163*s} cy={181*s} rx={9.6*s} ry={5.2*s} />
      </g>
      <ellipse className="hero-generator-shadow" cx={88*s} cy={271*s} rx={66*s} ry={9*s} />
      <line className="hero-generator-skid" x1={38*s} y1={263*s} x2={142*s} y2={257*s} />
      <line className="hero-generator-skid" x1={46*s} y1={270*s} x2={148*s} y2={264*s} />
      <polygon className="hero-generator-side" points={`${142*s},${218*s} ${142*s + SDX},${218*s + SDY} ${142*s + SDX},${255*s + SDY} ${142*s},${262*s}`} />
      <polygon className="hero-generator-top" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s + SDX},${218*s + SDY} ${34*s + SDX},${226*s + SDY}`} />
      <polygon className="hero-generator-face" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s},${262*s} ${34*s},${270*s}`} />
      <polygon className="hero-generator-stripe" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s},${230*s} ${34*s},${238*s}`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const stripeTopY = (x: number) => (226 - ((x - 34) * 8) / 108) * s;
        const stripeBottomY = (x: number) => (238 - ((x - 34) * 8) / 108) * s;
        return (
          <polygon
            key={index}
            className="hero-generator-mark"
            points={`${(43 + index * 12)*s},${stripeTopY(43 + index * 12)} ${(51 + index * 12)*s},${stripeTopY(51 + index * 12)} ${(47 + index * 12)*s},${stripeBottomY(47 + index * 12)} ${(39 + index * 12)*s},${stripeBottomY(39 + index * 12)}`}
          />
        );
      })}
      <g className="hero-generator-exhaust">
        <path className="hero-generator-exhaust-pipe" d={`M${140*s} ${224*s} C${148*s} ${218*s} ${151*s} ${212*s} ${157*s} ${208*s}`} />
        <polygon className="hero-generator-muffler" points={`${153*s},${206*s} ${169*s},${201*s} ${175*s},${209*s} ${158*s},${216*s}`} />
        <ellipse className="hero-generator-muffler-cap" cx={174*s} cy={205*s} rx={3.1*s} ry={5.1*s} transform={`rotate(-25 ${174*s} ${205*s})`} />
        <path className="hero-generator-exhaust-nozzle" d={`M${176*s} ${204*s} L${183*s} ${201*s}`} />
      </g>
      <path className="hero-generator-vent" d={`M${48*s} ${243*s} L${76*s} ${241*s} M${48*s} ${249*s} L${78*s} ${247*s} M${48*s} ${255*s} L${73*s} ${253*s}`} />
      <polygon className="hero-generator-panel" points={`${44*s},${240*s} ${84*s},${237*s} ${84*s},${258*s} ${44*s},${261*s}`} />
      <ellipse className="hero-generator-core" cx={116*s} cy={243*s} rx={11.5*s} ry={13.5*s} />
      <ellipse className="hero-generator-core-ring" cx={116*s} cy={243*s} rx={6.8*s} ry={8.5*s} />
      <path className="hero-generator-bolt-icon" d={`M${116*s} ${235*s} L${109*s} ${244*s} H${116*s} L${112*s} ${252*s} L${124*s} ${240*s} H${118*s} Z`} />
      <circle className="hero-generator-port" cx={136*s} cy={236*s} r={3.2*s} />
      <circle className="hero-generator-port hero-generator-port--lower" cx={139*s} cy={247*s} r={2.6*s} />
      <circle className="hero-generator-bolt" cx={41*s} cy={239*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={137*s} cy={232*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={41*s} cy={265*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={137*s} cy={257*s} r={1.6*s} />
      <text className="hero-generator-title" x={87*s} y={228.5*s} textAnchor="middle" transform={`rotate(-4 ${87*s} ${228.5*s})`} fontSize={`${20*s}`}>ADVERSARY</text>
      <text className="hero-generator-sub" x={87*s} y={234.2*s} textAnchor="middle" transform={`rotate(-4 ${87*s} ${234.2*s})`} fontSize={`${15*s}`}>SURVEILLANCE ZONE</text>
    </g>
  );
}

function TerrainIsland() {
  // Tower world-space footprint: x≈129–219, center x=174, base y≈194
  // Island is a wide isometric hexagonal slab, moved up (smaller y values)
  return (
    <g className="hero-terrain-island">
      <ellipse className="hero-island-shadow" cx="174" cy="220" rx="68" ry="13" />
      {/* Top face — wide hexagon, moved up */}
      <polygon className="hero-island-top" points="174,160 228,170 228,193 174,205 120,193 120,170" />
      {/* Front-bottom visible side face */}
      <polygon className="hero-island-side" points="120,193 228,193 234,208 174,216 114,208" />
      {/* Surface ridge texture lines for depth */}
      <path className="hero-island-ridge" d="M144,171 L212,193 M154,203 L208,166 M120,181 L174,205" />
      {/* Front edge highlight */}
      <path className="hero-island-front" d="M120,193 L174,205 L228,193" />
    </g>
  );
}

function GeneratorIsland() {
  const s = 1.5;
  const offsX = -120, offsY = -110;
  return (
    <g className="hero-generator-island" transform={`translate(${offsX} ${offsY})`}>
      <ellipse className="hero-generator-island-shadow" cx={91*s} cy={275*s} rx={88*s} ry={13*s} />
      <polygon className="hero-generator-island-top" points={`${12*s},${267*s} ${48*s},${241*s} ${135*s},${235*s} ${168*s},${257*s} ${132*s},${284*s} ${19*s},${286*s}`} />
      <polygon className="hero-generator-island-side" points={`${19*s},${286*s} ${132*s},${284*s} ${168*s},${257*s} ${162*s},${268*s} ${131*s},${294*s} ${15*s},${293*s}`} />
      <path className="hero-generator-island-ridge" d={`M${24*s} ${270*s} L${80*s} ${244*s} M${49*s} ${282*s} L${136*s} ${255*s} M${14*s} ${278*s} L${55*s} ${249*s}`} />
    </g>
  );
}

function ThreatBorder() {
  return (
    <g className="hero-threat-border" aria-hidden="true">
      {/* Territory ground fills behind everything */}
      <TerritoryFloor />
      <StageFloor />
      <TerrainIsland />
      <GeneratorIsland />
      {/* Upper right wall renders before generator (behind it in depth) */}
      <FenceUpperWall />

      <MeshTower />
      <PowerCables />

      <circle className="hero-signal-ring hero-signal-ring--s1" cx="183" cy="47" r="4" />
      <circle className="hero-signal-ring hero-signal-ring--s2" cx="183" cy="47" r="4" />
      <circle className="hero-signal-ring hero-signal-ring--s3" cx="183" cy="47" r="4" />

      <PowerGenerator />
      {/* Front wall renders AFTER generator — appears in front of it (correct isometric depth) */}
      <FenceFrontWall />
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

function emitHeroHit(hitId: number) {
  window.dispatchEvent(new CustomEvent('fadsec:hero-hit', { detail: { hitId } }));
}

const cursorSmokeConfigs = [
  { radiusX: 10.2, radiusY: 6.2, blur: 3.8, driftX: 0.15, driftY: 0.35 },
  { radiusX: 13.6, radiusY: 8.6, blur: 5.1, driftX: 0.35, driftY: 0.7 },
  { radiusX: 17.8, radiusY: 11.6, blur: 6.6, driftX: 0.55, driftY: 1.1 },
  { radiusX: 22.2, radiusY: 14.6, blur: 8.2, driftX: 0.8, driftY: 1.55 },
  { radiusX: 27, radiusY: 18, blur: 9.8, driftX: 1, driftY: 2 },
] as const;

function HeldShield({ impactRef }: { impactRef: RefObject<SVGGElement | null> }) {
  return (
    <g ref={impactRef}>
      <g transform="translate(606 78) rotate(10 92 120) scale(0.66)">
        <g className="hero-shield-rig">
          <circle className="hero-shield-halo hero-shield-halo--outer" cx="92" cy="118" r="102" />
          <circle className="hero-shield-halo hero-shield-halo--inner" cx="92" cy="118" r="76" />
          <path className="hero-shield-shadow" d="M92 206 C128 206 160 216 160 228 C160 242 128 252 92 252 C56 252 24 242 24 228 C24 216 56 206 92 206Z" />
          <g className="hero-shield-body">
            <path className="hero-shield-side" d={shieldPath} transform="translate(8 8)" />
            <path className="hero-shield-depth" d={shieldInsetPath} />
            <path className="hero-shield-face" d={shieldCorePath} />
            <g className="hero-shield-plate" clipPath="url(#hero-shield-clip)">
              <path className="hero-shield-plate-base" d={shieldCorePath} />
              <path className="hero-shield-highlight" d="M54 30 C64 18 78 12 92 12 C81 42 78 82 78 124 C78 162 82 194 88 220 C68 210 56 192 46 166 C38 142 34 110 34 84 C34 60 40 40 54 30Z" />
              <path className="hero-shield-emblem" d="M86 92 L100 116 L86 140 L72 116 Z" transform="rotate(4 86 116)" />
              <path className="hero-shield-emblem hero-shield-emblem--inner" d="M86 102 L92 116 L86 130 L80 116 Z" transform="rotate(4 86 116)" />
              <circle className="hero-shield-rivet" cx="50" cy="42" r="3.5" />
              <circle className="hero-shield-rivet" cx="130" cy="42" r="3.5" />
              <circle className="hero-shield-rivet" cx="40" cy="198" r="3.5" />
              <circle className="hero-shield-rivet" cx="140" cy="198" r="3.5" />
              <circle className="hero-shield-rivet hero-shield-rivet--top" cx="90" cy="26" r="4.1" />
              <circle className="hero-shield-rivet hero-shield-rivet--mid" cx="90" cy="216" r="4.1" />
            </g>
            <path className="hero-shield-core" d={shieldCorePath} />
            <path className="hero-shield-rim" d={shieldCorePath} />
          </g>
        </g>
      </g>
    </g>
  );
}

function GuardianLegs({
  backUpperLegRef,
  backLowerLegRef,
  frontUpperLegRef,
  frontLowerLegRef,
}: {
  backUpperLegRef: RefObject<SVGPathElement | null>;
  backLowerLegRef: RefObject<SVGPathElement | null>;
  frontUpperLegRef: RefObject<SVGPathElement | null>;
  frontLowerLegRef: RefObject<SVGPathElement | null>;
}) {
  return (
    <>
      <path ref={backUpperLegRef} className="hero-guardian-leg hero-guardian-leg--back" d={pathBetween(guardianBackHip, guardianBackKneeBase)} />
      <path ref={backLowerLegRef} className="hero-guardian-leg hero-guardian-leg--back" d={pathBetween(guardianBackKneeBase, guardianBackFootBase)} />
      <path ref={frontUpperLegRef} className="hero-guardian-leg hero-guardian-leg--front" d={pathBetween(guardianFrontHip, guardianFrontKneeBase)} />
      <path ref={frontLowerLegRef} className="hero-guardian-leg hero-guardian-leg--front" d={pathBetween(guardianFrontKneeBase, guardianFrontFootBase)} />
    </>
  );
}

function GuardianFace({ leftEyeRef, rightEyeRef }: { leftEyeRef: RefObject<SVGCircleElement | null>; rightEyeRef: RefObject<SVGCircleElement | null> }) {
  return (
    <g className="hero-guardian-headgroup" transform="translate(0 32)">
      <circle className="hero-guardian-head" cx="782" cy="50" r="42" />
      <path className="hero-guardian-head-ring" d="M742 50 C742 24 762 8 782 8 C804 8 822 24 822 50 C822 76 804 92 782 92 C762 92 742 76 742 50Z" />
      <g className="hero-guardian-eyes">
        <path className="hero-eye-socket hero-eye-socket--near" d="M754 43 H772 C772 57 754 57 754 43Z" />
        <path className="hero-eye-socket hero-eye-socket--far" d="M780 43 H798 C798 57 780 57 780 43Z" />
        <g clipPath="url(#hero-eye-clip)">
          <circle ref={leftEyeRef} className="hero-eyeball" cx="762" cy="48" r="4.1" />
          <circle ref={rightEyeRef} className="hero-eyeball" cx="786" cy="48" r="4.1" />
        </g>
      </g>
    </g>
  );
}

export default function HeroShield() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorGroupRef = useRef<SVGGElement>(null);
  const cursorReticleRef = useRef<SVGGElement>(null);
  const cursorCentreRef = useRef<SVGCircleElement>(null);
  const cursorChargeRingRef = useRef<SVGCircleElement>(null);
  const cursorShotRingRef = useRef<SVGCircleElement>(null);
  const cursorSmokeRefs = useRef<(SVGGElement | null)[]>([]);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const shieldImpactRef = useRef<SVGGElement>(null);
  const upperImpactRef = useRef<SVGGElement>(null);
  const shieldUpperArmRef = useRef<SVGPathElement>(null);
  const shieldForearmRef = useRef<SVGPathElement>(null);
  const shieldHandRigRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const backUpperLegRef = useRef<SVGPathElement>(null);
  const backLowerLegRef = useRef<SVGPathElement>(null);
  const frontUpperLegRef = useRef<SVGPathElement>(null);
  const frontLowerLegRef = useRef<SVGPathElement>(null);
  const impactFrameRef = useRef<number | null>(null);
  const eyeFrameRef = useRef<number | null>(null);
  const eyeLastTimeRef = useRef<number | null>(null);
  const cursorFrameRef = useRef<number | null>(null);
  const cursorStateRef = useRef({
    press: 0,
    scale: 1,
    scaleVelocity: 0,
    targetScale: 1,
    isHolding: false,
    shotPulse: 0,
    isVisible: false,
  });
  const eyeMotionRef = useRef([
    { ref: leftEyeRef, origin: { x: 762, y: 48 }, current: { x: 762, y: 48 }, velocity: { x: 0, y: 0 }, target: { x: 762, y: 48 } },
    { ref: rightEyeRef, origin: { x: 786, y: 48 }, current: { x: 786, y: 48 }, velocity: { x: 0, y: 0 }, target: { x: 786, y: 48 } },
  ]);

  const playImpact = useCallback(() => {
    if (impactFrameRef.current) {
      window.cancelAnimationFrame(impactFrameRef.current);
    }

    const duration = 260;
    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
    const applyImpact = (amount: number, shieldX: number) => {
      shieldImpactRef.current?.setAttribute('transform', `translate(${shieldX.toFixed(2)} 0)`);
      upperImpactRef.current?.setAttribute('transform', 'translate(0 0)');
      bodyRef.current?.setAttribute('d', interpolatePath(guardianBodyBase, guardianBodyHit, amount));
      
      // Horizontal recoil: elbow nudges right rotating upper arm, hand slides right, whole arm compresses naturally
      const elbow = interpolatePoint(guardianShieldElbowBase, guardianShieldElbowHit, amount);
      const shieldHand = interpolatePoint(guardianShieldHandBase, guardianShieldHandHit, amount);
      
      shieldUpperArmRef.current?.setAttribute('d', pathBetween(guardianShieldShoulder, elbow));
      shieldForearmRef.current?.setAttribute('d', pathBetween(elbow, shieldHand));
      
      // Pure horizontal translate — zero vertical movement
      shieldHandRigRef.current?.setAttribute(
        'transform',
        `translate(${(shieldHand.x - guardianShieldHandBase.x).toFixed(2)} 0)`
      );

      const backKnee = interpolatePoint(guardianBackKneeBase, guardianBackKneeHit, amount);
      const frontKnee = interpolatePoint(guardianFrontKneeBase, guardianFrontKneeHit, amount);
      backUpperLegRef.current?.setAttribute('d', pathBetween(guardianBackHip, backKnee));
      backLowerLegRef.current?.setAttribute('d', pathBetween(backKnee, guardianBackFootBase));
      frontUpperLegRef.current?.setAttribute('d', pathBetween(guardianFrontHip, frontKnee));
      frontLowerLegRef.current?.setAttribute('d', pathBetween(frontKnee, guardianFrontFootBase));
    };

    const step = (startTime: number) => {
      const tick = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        let absorb: number;
        let shieldX: number;

        if (progress < 0.42) {
          const phase = easeOut(progress / 0.42);
          absorb = phase;
          shieldX = 2.5 * phase;
        } else if (progress < 0.64) {
          const phase = easeOut((progress - 0.42) / 0.22);
          absorb = 1 - 0.65 * phase;
          shieldX = 2.5 - 3.5 * phase;
        } else {
          const phase = easeOut((progress - 0.64) / 0.36);
          absorb = 0.35 * (1 - phase);
          shieldX = -1 * (1 - phase);
        }

        applyImpact(absorb, shieldX);

        if (progress < 1) {
          impactFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        applyImpact(0, 0);
        impactFrameRef.current = null;
      };

      tick(startTime);
    };

    impactFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  const updateEyeState = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const screenCTM = svg?.getScreenCTM();
    const localTarget = (() => {
      if (!svg || !screenCTM) return null;

      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;

      return point.matrixTransform(screenCTM.inverse());
    })();

    if (!localTarget) return;

    eyeMotionRef.current.forEach((eye) => {
      const dx = localTarget.x - eye.origin.x;
      const dy = localTarget.y - eye.origin.y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(3.0, Math.hypot(dx, dy) / 30);

      eye.target.x = eye.origin.x + Math.cos(angle) * distance;
      eye.target.y = eye.origin.y + Math.sin(angle) * distance;
    });

    if (eyeFrameRef.current) return;

    const step = (time: number) => {
      const lastTime = eyeLastTimeRef.current ?? time;
      eyeLastTimeRef.current = time;
      const dt = Math.min(0.032, Math.max(0.001, (time - lastTime) / 1000));
      const stiffness = 280;
      const damping = 24;
      const maxOffset = 3.0;
      let stillMoving = false;

      eyeMotionRef.current.forEach((eye) => {
        const accelX = (eye.target.x - eye.current.x) * stiffness;
        const accelY = (eye.target.y - eye.current.y) * stiffness;

        eye.velocity.x = (eye.velocity.x + accelX * dt) * Math.exp(-damping * dt);
        eye.velocity.y = (eye.velocity.y + accelY * dt) * Math.exp(-damping * dt);
        eye.current.x += eye.velocity.x * dt;
        eye.current.y += eye.velocity.y * dt;

        const offsetX = eye.current.x - eye.origin.x;
        const offsetY = eye.current.y - eye.origin.y;
        const offsetDistance = Math.hypot(offsetX, offsetY);
        if (offsetDistance > maxOffset) {
          const scale = maxOffset / offsetDistance;
          eye.current.x = eye.origin.x + offsetX * scale;
          eye.current.y = eye.origin.y + offsetY * scale;

          const remainingX = eye.current.x - eye.origin.x;
          const remainingY = eye.current.y - eye.origin.y;
          if (remainingX * eye.velocity.x + remainingY * eye.velocity.y > 0) {
            eye.velocity.x *= 0.25;
            eye.velocity.y *= 0.25;
          }
        }

        if (eye.ref.current) {
          eye.ref.current.setAttribute('cx', String(eye.current.x));
          eye.ref.current.setAttribute('cy', String(eye.current.y));
        }

        if (Math.abs(eye.target.x - eye.current.x) > 0.02 || Math.abs(eye.target.y - eye.current.y) > 0.02) {
          stillMoving = true;
        }
      });

      if (stillMoving) {
        eyeFrameRef.current = window.requestAnimationFrame(step);
      } else {
        eyeFrameRef.current = null;
        eyeLastTimeRef.current = null;
      }
    };

    eyeFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const impactOffsets = [2916, 4266, 5616];
    const hitIntervals: number[] = [];
    const hitTimeouts = impactOffsets.map((offset, index) =>
      window.setTimeout(() => {
        playImpact();
        emitHeroHit(index);
        hitIntervals.push(window.setInterval(() => {
          playImpact();
          emitHeroHit(index);
        }, 4050));
      }, offset)
    );

    return () => {
      if (impactFrameRef.current) {
        window.cancelAnimationFrame(impactFrameRef.current);
      }
      hitTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      hitIntervals.forEach((intervalId) => window.clearInterval(intervalId));
    };
  }, [playImpact]);

  useEffect(() => {
    const heroSection = svgRef.current?.closest<HTMLElement>('.hero-section');
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!heroSection || !window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    const setCursorPosition = (clientX: number, clientY: number) => {
      if (cursorGroupRef.current) {
        cursorGroupRef.current.setAttribute('transform', `translate(${clientX} ${clientY})`);
      }
    };

    const showCursor = (event: PointerEvent) => {
      cursorStateRef.current.isVisible = true;
      cursorGroupRef.current?.setAttribute('opacity', '1');
      setCursorPosition(event.clientX, event.clientY);
      updateEyeState(event.clientX, event.clientY);
    };

    const hideCursor = () => {
      cursorStateRef.current.isVisible = false;
      cursorStateRef.current.isHolding = false;
      cursorStateRef.current.targetScale = 1;
      cursorGroupRef.current?.setAttribute('opacity', '0');
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!cursorStateRef.current.isVisible) {
        cursorStateRef.current.isVisible = true;
        cursorGroupRef.current?.setAttribute('opacity', '1');
      }
      setCursorPosition(event.clientX, event.clientY);
      updateEyeState(event.clientX, event.clientY);
    };

    const handlePointerDown = () => {
      if (!cursorStateRef.current.isVisible) return;
      cursorStateRef.current.isHolding = true;
      cursorStateRef.current.targetScale = 0.68;
      cursorStateRef.current.scaleVelocity = Math.min(cursorStateRef.current.scaleVelocity, -4);
      cursorStateRef.current.press = 1;
      cursorStateRef.current.shotPulse = 0;
    };

    const handlePointerUp = () => {
      if (!cursorStateRef.current.isHolding) return;
      cursorStateRef.current.isHolding = false;
      cursorStateRef.current.targetScale = 1;
      cursorStateRef.current.scaleVelocity = Math.max(cursorStateRef.current.scaleVelocity, 5.8);
      cursorStateRef.current.press = 0.75;
      cursorStateRef.current.shotPulse = 1;
    };

    const renderCursor = () => {
      const state = cursorStateRef.current;
      const dt = 1 / 60;
      state.press = state.isHolding ? Math.min(1, state.press + dt * 8.5) : Math.max(0, state.press - dt * 4.4);
      state.targetScale = state.isHolding ? 0.68 : 1;

      const scaleStiffness = 34;
      const scaleDamping = state.isHolding ? 11 : 8;
      const scaleAccel = (state.targetScale - state.scale) * scaleStiffness;
      state.scaleVelocity = (state.scaleVelocity + scaleAccel * dt) * Math.exp(-scaleDamping * dt);
      state.scale += state.scaleVelocity * dt;
      state.scale = Math.max(0.64, Math.min(1.16, state.scale));
      state.shotPulse = Math.max(0, state.shotPulse - dt * 4.2);

      const reticleScale = state.scale + state.shotPulse * 0.08;
      const centerRadius = 2.4 + state.press * 0.45;
      const chargeRadius = 8 + state.press * 5;
      const chargeOpacity = state.isHolding ? 0.18 + state.press * 0.42 : Math.max(0, state.press - 0.35) * 0.18;
      const shotProgress = 1 - state.shotPulse;
      const shotRadius = 10 + shotProgress * 16;
      const shotOpacity = state.shotPulse * 0.55;
      const smokeOpacity = state.isVisible && !motionReduced ? 0.1 + state.press * 0.18 + shotOpacity * 0.22 : 0;

      cursorReticleRef.current?.setAttribute('transform', `scale(${reticleScale.toFixed(3)})`);
      cursorCentreRef.current?.setAttribute('r', centerRadius.toFixed(2));
      cursorCentreRef.current?.setAttribute('opacity', (0.9 + state.press * 0.08).toFixed(2));
      cursorChargeRingRef.current?.setAttribute('r', chargeRadius.toFixed(2));
      cursorChargeRingRef.current?.setAttribute('opacity', chargeOpacity.toFixed(2));
      cursorShotRingRef.current?.setAttribute('r', shotRadius.toFixed(2));
      cursorShotRingRef.current?.setAttribute('opacity', shotOpacity.toFixed(2));

      cursorSmokeConfigs.forEach((config, index) => {
        const smoke = cursorSmokeRefs.current[index];
        if (!smoke) return;

        const opacity = smokeOpacity * Math.max(0.15, 1 - index * 0.18);
        const scale = 0.7 + state.press * 0.25 + shotOpacity * 0.35 + index * 0.04;

        smoke.setAttribute('transform', `translate(${(-index * config.driftX).toFixed(2)} ${(-config.driftY - index * 1.3).toFixed(2)}) scale(${scale.toFixed(3)})`);
        smoke.setAttribute('opacity', opacity.toFixed(2));
        smoke.style.filter = `blur(${config.blur.toFixed(2)}px)`;
      });

      if (motionReduced) {
        cursorSmokeConfigs.forEach((_, index) => {
          const smoke = cursorSmokeRefs.current[index];
          if (smoke) {
            smoke.setAttribute('opacity', '0');
          }
        });
        cursorChargeRingRef.current?.setAttribute('opacity', '0');
        cursorShotRingRef.current?.setAttribute('opacity', '0');
      }

      cursorFrameRef.current = window.requestAnimationFrame(renderCursor);
    };

    heroSection.addEventListener('pointerenter', showCursor);
    heroSection.addEventListener('pointerleave', hideCursor);
    heroSection.addEventListener('pointermove', handlePointerMove);
    heroSection.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    cursorFrameRef.current = window.requestAnimationFrame(renderCursor);

    return () => {
      if (cursorFrameRef.current) {
        window.cancelAnimationFrame(cursorFrameRef.current);
        cursorFrameRef.current = null;
      }
      if (eyeFrameRef.current) {
        window.cancelAnimationFrame(eyeFrameRef.current);
        eyeFrameRef.current = null;
      }
      heroSection.removeEventListener('pointerenter', showCursor);
      heroSection.removeEventListener('pointerleave', hideCursor);
      heroSection.removeEventListener('pointermove', handlePointerMove);
      heroSection.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [updateEyeState]);

  const cursorOverlay = (
    <svg className="hero-cursor-overlay" aria-hidden="true">
      <g ref={cursorGroupRef} className="hero-custom-cursor" opacity="0" pointerEvents="none">
        {cursorSmokeConfigs.map((config, index) => (
          <g
            key={`cursor-smoke-${index}`}
            ref={(node) => {
              cursorSmokeRefs.current[index] = node;
            }}
            className="hero-cursor-smoke"
            opacity={0}
          >
            <ellipse
              data-smoke-shape
              className="hero-cursor-smoke-cloud"
              cx="0"
              cy="0"
              rx={config.radiusX}
              ry={config.radiusY}
              fill="rgba(255, 63, 87, 0.34)"
              stroke="rgba(255, 178, 188, 0.18)"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              data-smoke-shape
              className="hero-cursor-smoke-cloud hero-cursor-smoke-cloud--inner"
              cx="0"
              cy="0"
              rx={config.radiusX * 0.55}
              ry={config.radiusY * 0.55}
              fill="rgba(255, 202, 208, 0.22)"
            />
          </g>
        ))}
        <circle ref={cursorShotRingRef} className="hero-cursor-shot-ring" cx="0" cy="0" r="11" fill="none" stroke="rgba(255, 63, 87, 0.72)" strokeWidth="1.4" opacity="0" vectorEffect="non-scaling-stroke" />
        <g ref={cursorReticleRef} className="hero-cursor-reticle">
          <circle ref={cursorChargeRingRef} className="hero-cursor-charge-ring" cx="0" cy="0" r="9.5" fill="rgba(255, 63, 87, 0.08)" stroke="rgba(255, 63, 87, 0.72)" strokeWidth="1.2" opacity="0" vectorEffect="non-scaling-stroke" />
          <line className="hero-cursor-h" x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255, 63, 87, 0.94)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          <line className="hero-cursor-v" x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255, 63, 87, 0.94)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          <circle ref={cursorCentreRef} className="hero-cursor-center" cx="0" cy="0" r="2.4" fill="rgba(255, 63, 87, 0.98)" />
        </g>
      </g>
    </svg>
  );

  return (
    <>
      <div className="hero-defense" aria-label="FadSec Lab blocks trackers, spyware, and data brokers before they reach users">
      <svg ref={svgRef} className="hero-defense-svg" viewBox="0 0 900 300" role="img" focusable="false">
        <defs>
          <radialGradient id="hero-guardian-head" cx="34%" cy="26%" r="70%">
            <stop offset="0%" stopColor="rgba(58,64,77,1)" />
            <stop offset="44%" stopColor="rgba(36,41,52,1)" />
            <stop offset="100%" stopColor="rgba(15,18,25,1)" />
          </radialGradient>
          <linearGradient id="hero-guardian-body" x1="744" y1="136" x2="812" y2="238" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(44,49,59,1)" />
            <stop offset="44%" stopColor="rgba(23,28,36,1)" />
            <stop offset="100%" stopColor="rgba(10,12,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-face-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(219,68,86,0.98)" />
            <stop offset="35%" stopColor="rgba(168,31,48,0.98)" />
            <stop offset="72%" stopColor="rgba(109,15,31,0.98)" />
            <stop offset="100%" stopColor="rgba(53,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-side-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(136,22,40,0.98)" />
            <stop offset="100%" stopColor="rgba(54,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-plate-grad" x1="0" x2="0.95" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(228,81,99,0.96)" />
            <stop offset="38%" stopColor="rgba(174,40,59,0.98)" />
            <stop offset="72%" stopColor="rgba(109,15,31,0.98)" />
            <stop offset="100%" stopColor="rgba(52,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-boss-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(238, 115, 129, 0.98)" />
            <stop offset="45%" stopColor="rgba(192, 52, 71, 0.98)" />
            <stop offset="100%" stopColor="rgba(93, 18, 31, 1)" />
          </linearGradient>
          <linearGradient id="hero-shield-rivet-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(232, 170, 177, 0.98)" />
            <stop offset="55%" stopColor="rgba(164, 74, 89, 1)" />
            <stop offset="100%" stopColor="rgba(83, 29, 41, 1)" />
          </linearGradient>
          <linearGradient id="hero-shield-highlight-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,242,243,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="hero-shield-core" cx="42%" cy="35%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="hero-floor" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(232,51,74,0.08)" />
            <stop offset="52%" stopColor="rgba(232,51,74,0.16)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </linearGradient>
          <clipPath id="hero-shield-clip">
            <path d={shieldCorePath} />
          </clipPath>
          <clipPath id="hero-eye-clip">
            <path d="M754 43 H772 C772 57 754 57 754 43Z" />
            <path d="M780 43 H798 C798 57 780 57 780 43Z" />
          </clipPath>
          <linearGradient id="hero-border-zone-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#03060e" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#0a0e1e" stopOpacity="0.72" />
          </linearGradient>
          <pattern id="hero-border-hatch" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="12" x2="12" y2="0" stroke="rgba(255, 86, 62, 0.055)" strokeWidth="0.9" />
            <line x1="0" y1="0" x2="12" y2="12" stroke="rgba(255, 140, 112, 0.035)" strokeWidth="0.7" />
          </pattern>
          {/* Chain-link diamond mesh for fence panel fill */}
          <pattern id="hero-fence-mesh-pat" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="4.5" y2="4.5" stroke="rgba(255, 146, 120, 0.48)" strokeWidth="0.7" />
            <line x1="4.5" y1="4.5" x2="9" y2="0" stroke="rgba(255, 146, 120, 0.48)" strokeWidth="0.7" />
            <line x1="0" y1="4.5" x2="4.5" y2="9" stroke="rgba(210, 92, 74, 0.42)" strokeWidth="0.65" />
            <line x1="4.5" y1="9" x2="9" y2="4.5" stroke="rgba(210, 92, 74, 0.42)" strokeWidth="0.65" />
          </pattern>
          <pattern id="hero-fence-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 M6 0 L0 6" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.45" />
          </pattern>
          <pattern id="hero-hazard-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="#7f1d1d" />
            <rect x="5" width="5" height="10" fill="#18181b" />
          </pattern>

          {/* Concrete Quarantine Wall Gradients */}
          <linearGradient id="hero-concrete-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c2c31" />
            <stop offset="40%" stopColor="#3a3a41" />
            <stop offset="80%" stopColor="#25252a" />
            <stop offset="100%" stopColor="#1c1c1f" />
          </linearGradient>
        </defs>

        <ellipse className="hero-defense-floor" cx="520" cy="254" rx="350" ry="24" />

        <ThreatBorder />
        {threats.map((threat) => (
          <ThreatArrow key={threat.id} {...threat} />
        ))}

        <ShockBurst className="hero-shield-hit hero-shield-hit--one hero-shockfield hero-shockfield--one" delay="0s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--two hero-shockfield hero-shockfield--two" delay="1.35s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--three hero-shockfield hero-shockfield--three" delay="2.7s" />

        <g className="hero-guardian">
          <ellipse className="hero-guardian-shadow" cx="760" cy="260" rx="118" ry="20" />
          <g className="hero-guardian-recoil">
            <g transform="translate(-10 2)">
              <GuardianLegs
                backUpperLegRef={backUpperLegRef}
                backLowerLegRef={backLowerLegRef}
                frontUpperLegRef={frontUpperLegRef}
                frontLowerLegRef={frontLowerLegRef}
              />
              <g className="hero-guardian-upper">
                <g ref={upperImpactRef}>
                  <path ref={shieldUpperArmRef} className="hero-guardian-arm hero-guardian-arm--shield" d={pathBetween(guardianShieldShoulder, guardianShieldElbowBase)} />
                  <path ref={shieldForearmRef} className="hero-guardian-arm hero-guardian-arm--shield" d={pathBetween(guardianShieldElbowBase, guardianShieldHandBase)} />
                  <g ref={shieldHandRigRef}>
                    <path className="hero-guardian-hand hero-guardian-hand--shield" d="M694 171 C696 168 700 167 703 170 C702 175 698 176 695 174 Z" />
                    <HeldShield impactRef={shieldImpactRef} />
                  </g>
                  <path className="hero-guardian-arm hero-guardian-arm--flag" d="M780 143 L820 142 L872 109" />
                    {/* place flag so its bottom-right aligns with palm center (872,109) */}
                    <image className="hero-held-flag" href={flagImg} x="736" y="8" width="180" height="135" preserveAspectRatio="xMidYMid meet" />
                    <ellipse className="hero-guardian-hand hero-guardian-hand--flag" cx="872" cy="109" rx="10" ry="8" />
                  <path ref={bodyRef} className="hero-guardian-body" d={guardianBodyBase} />
                  <GuardianFace leftEyeRef={leftEyeRef} rightEyeRef={rightEyeRef} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      </div>
      {createPortal(cursorOverlay, document.body)}
    </>
  );
}
