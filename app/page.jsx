"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { WalletIcon, ChallengeIcon, MiningIcon, FriendsIcon, ProfileIcon, LeaderboardIcon } from "../components/Icons";
import WalletModal from "../components/WalletModal";
import { TonConnect } from '@tonconnect/sdk';

export default function Page() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [totalPoints, setTotalPoints] = useState(0);
  const [balance, setBalance] = useState(0);
  const [storage, setStorage] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [tonConnect, setTonConnect] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/kashifrind143-dev/ROAR-UI/main/public/tonconnect-manifest.json' });
      setTonConnect(connector);

      connector.onStatusChange(async (wallet) => {
        setWalletAddress(wallet?.account?.address || null);
        if (wallet?.account?.address) {
          try {
            const response = await fetch(`/api/users?address=${wallet.account.address}`);
            const data = await response.json();

            if (data?.user) {
              setUsername(data.user.username);
              setTotalPoints(data.user.totalPoints);
              setBalance(data.user.balance);
              setStorage(data.user.storage);
              setRemainingTime(data.user.lastClaimTime ? new Date(data.user.lastClaimTime).getTime() - Date.now() : 0);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const storedLastClaim = localStorage.getItem("lastClaim");
    if (storedLastClaim) {
      const lastClaimTime = parseInt(storedLastClaim, 10);
      const timeSinceLastClaim = Date.now() - lastClaimTime;
      const remaining = Math.max(0, 4 * 60 * 60 * 1000 - timeSinceLastClaim);
      setRemainingTime(remaining);
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000;
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
    } else {
      setIsClaiming(false);
    }
    return () => clearInterval(intervalId);
  }, [remainingTime]);

  useEffect(() => {
    localStorage.setItem("lastClaim", String(Date.now() - (4 * 60 * 60 * 1000 - remainingTime)));
  }, [remainingTime]);

  useEffect(() => {
    const storedLastClaim = localStorage.getItem("lastClaim");
    if (storedLastClaim) {
      const lastClaimTime = parseInt(storedLastClaim, 10);
      const timeSinceLastClaim = Date.now() - lastClaimTime;
      const remaining = Math.max(0, 4 * 60 * 60 * 1000 - timeSinceLastClaim);
      setRemainingTime(remaining);
      setIsClaiming(remaining > 0);
    }
  }, []);

  const [lastClaim, setLastClaim] = useState(() => {
    const s = typeof window !== 'undefined' && window.localStorage.getItem("lastClaim");
    return s ? parseInt(s) : 0;
  });

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUsername(user.username || "Unknown User");
        // Note: Telegram does not directly provide a profile picture URL.
        // You might need a backend service to fetch it using the user ID.
        // For now, we'll keep the default avatar.
        // setAvatarUrl(user.photo_url);
      }
    }
  }, [setUsername]);

  useEffect(() => {
    const fetchUserData = async () => {
      const username = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
      const res = await fetch(`/api/user?username=${username}`);
      const data = await res.json();
      if (data?.user) {
        setUsername(data.user.username);
      }
    };
    fetchUserData();
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)));
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const claim = () => {
    if (isClaiming || remainingTime > 0) return;

    setIsClaiming(true);
    // Simulate adding 10 Roar Points
    setTotalPoints((prevPoints) => Number((prevPoints + 10).toFixed(3)));

    // Set the countdown timer to 4 hours
    const claimTime = Date.now();
    const endTime = claimTime + 4 * 60 * 60 * 1000;
    setRemainingTime(endTime - Date.now());
    localStorage.setItem("lastClaim", claimTime.toString());
  };

  // Dial geometry
  const size = 260;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cap = 1.0;
  const progress = Math.min(1, 1 - remainingTime / (4 * 60 * 60 * 1000));
  const dash = circ * progress;

  const connectWallet = async () => {
    try {
      tonConnect?.openWallet();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background orbit and planets (subtle like first mockup) */}
      <div className="absolute inset-0 orbits">
        <div className="absolute left-6 top-36 w-6 h-6 rounded-full bg-neon-orange/80 planet animate-floaty animate-glowPulse"></div>
        <div className="absolute right-10 top-64 w-3 h-3 rounded-full bg-neon-purple/80 planet animate-floaty animate-glowPulse" style={{animationDelay:"-1.5s"}}></div>
        <div className="absolute right-6 bottom-56 w-8 h-8 rounded-full bg-neon-blue/70 planet animate-floaty animate-glowPulse" style={{animationDelay:"-2.4s"}}></div>
        <div className="absolute left-20 bottom-20 w-4 h-4 rounded-full bg-neon-purple/70 planet animate-floaty animate-glowPulse" style={{animationDelay:"-3s"}}></div>
        <div className="absolute right-1/4 top-1/4 w-5 h-5 rounded-full bg-neon-orange/70 planet animate-floaty animate-glowPulse" style={{animationDelay:"-4s"}}></div>
      </div>

      {/* Header mimic */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button className="text-white/70">Cancel</button>
        <div className="text-center">
          <p className="text-sm text-white/70 tracking-widest">ROAR</p>
          <p className="text-[11px] text-white/40">bot</p>
        </div>
        <button className="text-white/70">•••</button>
      </div>

      {/* Profile chip */}
      <div className="px-4 mt-4">
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-xl object-cover"/>
          <div className="flex-1">
            <p className="text-[13px] font-semibold">{username}</p>
            <p className="text-[12px] text-cyan-300">Total: <span className="text-white">{totalPoints.toLocaleString()}</span></p>
          </div>
          <span className="text-white/50">›</span>
        </div>
      </div>

      {/* Center Dial - exact first mockup look with subtle animation */}
      <div className="flex flex-col items-center mt-6">
        <motion.div
          className="relative"
          style={{width:size,height:size}}
          animate={{ rotate: [0, 0.8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={size} height={size} className="dial">
            <defs>
              <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00BFFF" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="rgba(0,0,0,.6)"/>
            <circle cx={size/2} cy={size/2} r={r} stroke="url(#glow)" strokeWidth={stroke} fill="none"
              strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ filter: remainingTime <= 0 ? "drop-shadow(0 0 12px rgba(0, 191, 255, .8))" : "none" }}
            />
            <circle cx={size/2} cy={size/2} r={r - 20} stroke="rgba(255,255,255,.08)" strokeWidth="1" fill="none" />
            <circle cx={size/2} cy={size/2} r={r - 40} stroke="rgba(255,255,255,.08)" strokeWidth="1" fill="none" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-white/70 text-sm">In storage:</p>
            <p className="text-4xl font-extrabold text-white drop-shadow-[0_0_30px_rgba(0,191,255,0.85)]">{storage.toFixed(6)}</p>
            <div className="mt-2 text-[13px]">
              <p className="text-neon-blue font-medium">Balance: <span className="text-white">{balance.toFixed(2)} ROAR</span></p>
            </div>
            <p className="mt-1 text-[12px] text-neon-blue/80 tracking-widest">{remainingTime>0 ? `${remainingParts.h}H : ${String(remainingParts.m).padStart(2,"0")}M : ${String(remainingParts.s).padStart(2,"0")}S` : "READY"}</p>
          </div>
        </motion.div>

        {/* rate chip */}
        <div className="mt-3 px-4 py-2 rounded-xl glass text-[13px]">
          <span className="align-middle">⚡</span> <span>0.01 ROAR/hour</span>
        </div>

        {/* Claim button - solid (first mockup look) with tap feedback */}
        <motion.button
          whileTap={{ scale: isClaiming ? 1 : 0.98 }}
          onClick={claim}
          disabled={isClaiming || remainingTime > 0}
          className={`mt-5 w-72 py-3 rounded-2xl font-semibold shadow-glow transition
            ${isClaiming || remainingTime > 0
              ? "bg-slate-700/80 text-white/60 cursor-not-allowed"
              : "bg-neon-blue hover:bg-neon-blue/80 text-white animate-glowPulse"
            }`}
        >
          {remainingTime > 0
            ? `Next claim in: ${formatTime(remainingTime)}`
            : "Claim"}
        </motion.button>
      </div>

      {/* Bottom nav - first mockup style but required order */}
      <div className="fixed bottom-6 left-0 right-0 px-5">
        <div className="mx-auto max-w-sm glass rounded-3xl px-4 py-3 flex items-center justify-around">
          <motion.div 
            className="flex flex-col items-center text-white/70 text-[11px]" 
            onClick={() => setIsWalletModalOpen(true)}
            whileTap={{ scale: 0.9 }}
          >
            <WalletIcon className="mb-1" />
            <span>Wallet</span>
          </motion.div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <ChallengeIcon className="mb-1" />
            <span>Boost</span>
          </div>
          <div className="relative -mt-8">
            <div className="w-14 h-14 rounded-full bg-neon-blue/20 border border-neon-blue/50 flex items-center justify-center shadow-glow">
              <MiningIcon className="text-neon-blue" />
            </div>
            <p className="text-center text-[11px] mt-1 text-neon-blue">Mining</p>
          </div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <LeaderboardIcon className="mb-1" />
            <span>Friends</span>
          </div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <ProfileIcon className="mb-1" />
            <span>Profile</span>
          </div>
        </div>
      </div>
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
