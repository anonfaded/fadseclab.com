import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './Avatar.css';

const Avatar: React.FC<{ simplified?: boolean }> = ({ simplified = false }) => {
  const hitRigRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftSocketRef = useRef<HTMLDivElement>(null);
  const rightSocketRef = useRef<HTMLDivElement>(null);
  const blinkTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const updateEyeState = useCallback((targetX: number, targetY: number) => {
    const eyes = [
      { ref: leftEyeRef, socket: leftSocketRef },
      { ref: rightEyeRef, socket: rightSocketRef },
    ];

    // Distance-based eye color
    if (simplified && containerRef.current) {
      const avatarRect = containerRef.current.getBoundingClientRect();
      const avatarCX = avatarRect.left + avatarRect.width / 2;
      const avatarCY = avatarRect.top + avatarRect.height / 2;
      const distanceToAvatar = Math.sqrt(Math.pow(targetX - avatarCX, 2) + Math.pow(targetY - avatarCY, 2));
      const t = Math.min(1, Math.max(0, 1 - distanceToAvatar / 700));
      // Interpolate color: white (far) -> brand red (close)
      const r = Math.round(240 - (240 - 232) * t);
      const g = Math.round(240 - (240 - 51) * t);
      const b = Math.round(245 - (245 - 74) * t);
      const color = `rgb(${r}, ${g}, ${b})`;
      // Interpolate glow: white glow (far) -> red glow (close)
      const glowInner = `0 0 ${Math.round(3 + 1 * t)}px rgba(${Math.round(255 - (255-232) * t)}, ${Math.round(255 - (255-51) * t)}, ${Math.round(255 - (255-74) * t)}, ${(0.5 + 0.2 * t).toFixed(2)})`;
      const glowOuter = `0 0 ${Math.round(10 + 4 * t)}px rgba(${Math.round(255 - (255-232) * t)}, ${Math.round(255 - (255-51) * t)}, ${Math.round(255 - (255-74) * t)}, ${(0.15 + 0.15 * t).toFixed(2)})`;

      eyes.forEach(({ ref }) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          backgroundColor: color,
          boxShadow: `${glowInner}, ${glowOuter}`,
          duration: 0.35,
          overwrite: 'auto',
        });
      });
    }

    eyes.forEach(({ ref, socket }) => {
      if (!ref.current || !socket.current) return;

      const rect = socket.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(targetY - centerY, targetX - centerX);
      const maxDist = rect.width / 3.6;
      const dist = Math.min(
        maxDist,
        Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2)) / 10
      );

      const moveX = dist * Math.cos(angle);
      const moveY = dist * Math.sin(angle);

      gsap.to(ref.current, {
        x: moveX,
        y: moveY,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, [simplified]);

  useEffect(() => {
    if (simplified || !rigRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ repeat: -1, repeatDelay: 3.13 })
        .to(rigRef.current, {
          x: -2,
          y: 1,
          rotate: -1.6,
          scaleX: 0.988,
          scaleY: 1.012,
          duration: 0.16,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        .to(rigRef.current, {
          x: 1.1,
          y: -0.5,
          rotate: 0.9,
          scaleX: 1.006,
          scaleY: 0.995,
          duration: 0.2,
          ease: 'power1.inOut',
          overwrite: 'auto',
        })
        .to(rigRef.current, {
          x: 0,
          y: 0,
          rotate: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.56,
          ease: 'elastic.out(1, 0.38)',
          overwrite: 'auto',
        });
    }, rigRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (simplified) return;

    const handleHeroHit = (event: Event) => {
      if (!hitRigRef.current) return;

      const hitId = (event as CustomEvent<{ hitId: number }>).detail?.hitId ?? 0;
      const kickFrames = [
        { x: -5, y: 2, rotate: -7, scaleX: 0.975, scaleY: 1.03 },
        { x: 4.5, y: -1, rotate: 6, scaleX: 1.02, scaleY: 0.98 },
        { x: -2, y: 0.5, rotate: -2.4, scaleX: 0.993, scaleY: 1.01 },
      ];
      const kick = kickFrames[hitId % kickFrames.length];

      gsap.killTweensOf(hitRigRef.current);
      gsap
        .timeline({ overwrite: 'auto' })
        .to(hitRigRef.current, {
          x: kick.x,
          y: kick.y,
          rotate: kick.rotate,
          scaleX: kick.scaleX,
          scaleY: kick.scaleY,
          duration: 0.14,
          ease: 'power4.out',
        })
        .to(hitRigRef.current, {
          x: 0,
          y: 0,
          rotate: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.28,
          ease: 'elastic.out(1.1, 0.35)',
        });
    };

    window.addEventListener('fadsec:hero-hit', handleHeroHit);
    return () => window.removeEventListener('fadsec:hero-hit', handleHeroHit);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      updateEyeState(e.clientX, e.clientY);
    };

    updateEyeState(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [updateEyeState]);

  useEffect(() => {
    if (simplified) return;

    const blink = () => {
      const sockets = [leftSocketRef.current, rightSocketRef.current];
      gsap.to(sockets, {
        height: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          blinkTimerRef.current = window.setTimeout(blink, 2500 + Math.random() * 4000);
        },
      });
    };

    blinkTimerRef.current = window.setTimeout(blink, 3000);

    return () => {
      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
      }
    };
  }, [simplified]);

  return simplified ? (
    <aside className="avatar-container" aria-label="FadSec Lab avatar" ref={containerRef}>
      <div className="avatar-wrapper">
        <div className="avatar-head">
          <div className="eyes-container">
            <div className="eye-socket" ref={leftSocketRef}>
              <div className="eyeball" ref={leftEyeRef} />
            </div>
            <div className="eye-socket" ref={rightSocketRef}>
              <div className="eyeball" ref={rightEyeRef} />
            </div>
          </div>
        </div>
        <div className="avatar-body" />
      </div>
    </aside>
  ) : (
    <aside className="avatar-container" aria-label="FadSec Lab avatar">
      <motion.div
        className="avatar-wrapper"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="avatar-hit-rig" ref={hitRigRef}>
          <div className="avatar-motion-rig" ref={rigRef}>
          <motion.div
            className="avatar-head"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="eyes-container">
              <div className="eye-socket" ref={leftSocketRef}>
                <div className="eyeball" ref={leftEyeRef} />
              </div>
              <div className="eye-socket" ref={rightSocketRef}>
                <div className="eyeball" ref={rightEyeRef} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="avatar-body"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default Avatar;
