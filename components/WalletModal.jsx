"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TelegramIcon } from "./Icons";
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState, useCallback } from 'react';

export default function WalletModal({ isOpen, onClose }) {
  const [tonConnectUI, wallet, connectionStatus, setConnectionStatus] = useTonConnectUI();
  const [telegramInfo, setTelegramInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const sendUserDataToBackend = async (address, username, photo_url, telegramId) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, username, photo_url, telegramId }),
      });

      if (response.ok) {
        console.log('User data sent to backend successfully!');
      } else {
        console.error('Failed to send user data to backend.');
      }
    } catch (error) {
      console.error('Error sending user data to backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTelegramInfo = useCallback(async () => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
      setTelegramInfo({
        id: telegramUser.id,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url,
      });

      sendUserDataToBackend(wallet?.address, telegramUser.username, telegramUser.photo_url, telegramUser.id);
    } else {
      setTelegramInfo(null);
    }
  }, [wallet, sendUserDataToBackend]);

  useEffect(() => {
    if (wallet?.address) {
      console.log('Wallet connected:', wallet.address);
      fetchTelegramInfo();
    } else {
      setTelegramInfo(null);
    }
  }, [wallet, fetchTelegramInfo]);

  const handleConnect = useCallback(async () => {
    setErrorMessage(null);
    if (connectionStatus === 'connected') {
      tonConnectUI.disconnect();
    } else {
      try {
        setIsLoading(true);
        await tonConnectUI.connectWallet();
      } catch (e) {
        console.error(e);
        if (e.message?.includes('Operation aborted')) {
          setErrorMessage('Wallet connection cancelled, please try again.');
        } else {
          setErrorMessage('Failed to connect to wallet.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [tonConnectUI, connectionStatus]);


  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
            className="bg-[#111] border-4 border-cyan-300 rounded-2xl shadow-glow-neon-blue w-full max-w-sm p-6 text-white text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Connect to Telegram Wallet</h2>

            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 px-6 rounded-lg shadow-glow-neon-blue hover:scale-105 transform transition-transform duration-200"
            >
              <TelegramIcon />
              {connectionStatus === 'connected' ? `Disconnect ${shortenAddress(wallet?.address)}` : "Connect to Telegram Wallet"}
            </button>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

            {isLoading && <p className="mt-4">Connecting...</p>}

            {connectionStatus === 'connected' && wallet?.address && (
              <div className="mt-4">
                {window.Telegram && window.Telegram.WebApp && telegramInfo ? (
                  <>
                    {telegramInfo.photo_url && (
                      <img
                        src={telegramInfo.photo_url}
                        alt="Telegram Profile"
                        className="rounded-full w-12 h-12 mx-auto mb-2"
                      />
                    )}
                    <p>Telegram: @{telegramInfo.username}</p>
                  </>
                ) : (
                  <p>Telegram user information missing.</p>
                )}
                <p>Wallet: {shortenAddress(wallet.address)}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-4 text-white/70 hover:text-white font-bold transition-colors duration-200"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
