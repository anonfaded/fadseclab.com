import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './Avatar.css';

const Avatar: React.FC = () => {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftSocketRef = useRef<HTMLDivElement>(null);
  const rightSocketRef = useRef<HTMLDivElement>(null);
  const blinkTimerRef = useRef<number | null>(null);

  const updateEyeState = useCallback((targetX: number, targetY: number) => {
    const eyes = [
      { ref: leftEyeRef, socket: leftSocketRef },
      { ref: rightEyeRef, socket: rightSocketRef },
    ];

    eyes.forEach(({ ref, socket }) => {
      if (!ref.current || !socket.current) return;

      const rect = socket.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(targetY - centerY, targetX - centerX);
      const maxDist = rect.width / 4;
      const dist = Math.min(
        maxDist,
        Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2)) / 12
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
  }, []);

  return (
    <aside className="avatar-container" aria-label="FadSec Lab avatar">
      <motion.div
        className="avatar-wrapper"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="avatar-head"
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
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
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
      </motion.div>
    </aside>
  );
};

export default Avatar;
