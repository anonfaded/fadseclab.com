import flagImg from '../../assets/images/fadseclab_flag.png';
import './HeroShield.css';
import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';

const threats = [
  { id: 'trackers', label: 'Trackers', lane: 82, delay: '0s', color: '#48d3ff', path: 'M154 86 C330 26 510 52 650 106' },
  { id: 'brokers', label: 'Data brokers', lane: 132, delay: '1.35s', color: '#84ff56', path: 'M154 132 C334 104 506 114 652 132' },
  { id: 'spyware', label: 'Spyware', lane: 182, delay: '2.7s', color: '#ffd166', path: 'M154 178 C330 232 510 208 646 154' },
];

const shieldPath = 'M90 4 C118 12 146 18 168 30 L160 128 C154 178 126 214 90 238 C54 214 26 178 20 128 L12 30 C34 18 62 12 90 4Z';
const shieldInsetPath = 'M90 12 C114 19 137 25 155 34 L149 124 C144 166 119 198 90 220 C61 198 36 166 31 124 L25 34 C43 25 66 19 90 12Z';
const shieldCorePath = 'M90 0 C118 10 146 17 170 29 L162 130 C156 182 127 220 90 244 C53 220 24 182 18 130 L10 29 C34 17 62 10 90 0Z';
const guardianBodyBase = 'M781 147 L768 190'; // Top moved down to eliminate neck bump
const guardianBodyHit = guardianBodyBase;
const guardianShieldShoulder = { x: 780, y: 143 }; // Keep at original position
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

function rotateAround(point: { x: number; y: number }, pivot: { x: number; y: number }, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - pivot.x;
  const dy = point.y - pivot.y;

  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos,
  };
}

function angleBetween(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
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
        let absorb = 0;
        let shieldX = 0;

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
    let pointerFrame = 0;
    let nextX = window.innerWidth / 2;
    let nextY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        updateEyeState(nextX, nextY);
        pointerFrame = 0;
      });
    };

    updateEyeState(window.innerWidth / 2, window.innerHeight / 2);
    if (!window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
      }
      if (eyeFrameRef.current) {
        window.cancelAnimationFrame(eyeFrameRef.current);
        eyeFrameRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateEyeState]);

  return (
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
        </defs>

        <ellipse className="hero-defense-floor" cx="520" cy="254" rx="350" ry="24" />

        {threats.map((threat) => (
          <ThreatArrow key={threat.id} {...threat} />
        ))}

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
                  <path className="hero-guardian-arm hero-guardian-arm--flag" d="M790 143 L832 136 L872 108" />
                    {/* place flag so its bottom-right aligns with palm center (872,108) */}
                    <image className="hero-held-flag" href={flagImg} x="736" y="7" width="180" height="135" preserveAspectRatio="xMidYMid meet" />
                    <ellipse className="hero-guardian-hand hero-guardian-hand--flag" cx="872" cy="108" rx="10" ry="8" />
                  <path ref={bodyRef} className="hero-guardian-body" d={guardianBodyBase} />
                  <GuardianFace leftEyeRef={leftEyeRef} rightEyeRef={rightEyeRef} />
                </g>
              </g>
            </g>
          </g>
        </g>

        <ShockBurst className="hero-shield-hit hero-shield-hit--one hero-shockfield hero-shockfield--one" delay="0s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--two hero-shockfield hero-shockfield--two" delay="1.35s" />
        <ShockBurst className="hero-shield-hit hero-shield-hit--three hero-shockfield hero-shockfield--three" delay="2.7s" />
      </svg>
    </div>
  );
}
