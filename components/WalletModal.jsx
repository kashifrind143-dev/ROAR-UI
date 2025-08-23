"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TelegramIcon } from "./Icons"; // Assuming you have a TelegramIcon component

export default function WalletModal({ isOpen, onClose }) {
  const handleConnect = () => {
    console.log("Connecting to Telegram Wallet...");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/80 border border-neon-blue/50 rounded-2xl shadow-glow-neon-blue w-full max-w-sm p-6 text-white text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Connect Wallet</h2>
            
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 px-6 rounded-lg shadow-glow-neon-purple hover:scale-105 transform transition-transform duration-200"
            >
              <TelegramIcon />
              Connect to Telegram Wallet
            </button>

            <button
              onClick={onClose}
              className="mt-4 text-white/70 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
