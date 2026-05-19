import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TransitionOverlay.css';

interface TransitionOverlayProps {
  isVisible: boolean;
  targetName: string;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isVisible, targetName }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="transition-overlay-pro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="transition-content-pro">
            <motion.div
              className="loader-pro"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="loader-ring-pro" />
              <div className="loader-ring-static" />
            </motion.div>
            
            <motion.h2
              className="transition-title-pro"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Directing to {targetName}...
            </motion.h2>
            
            <motion.div
              className="transition-status-pro"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              SECURE_HANDSHAKE_ESTABLISHED
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;
