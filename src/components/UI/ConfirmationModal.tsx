import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, targetName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-root">
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content glass"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="modal-header">
                <ExternalLink size={20} className="modal-icon" />
                <h3 className="modal-title">External Uplink</h3>
                <button className="close-x" onClick={onClose}><X size={16} /></button>
            </div>
            
            <div className="modal-body">
              <p>You are moving to <span className="text-high-contrast">{targetName}</span>.</p>
              <p className="sub-text">This will open in a separate secure browser tab.</p>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={onClose}>Abort</button>
              <button className="confirm-btn crimson" onClick={onConfirm}>Proceed</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
