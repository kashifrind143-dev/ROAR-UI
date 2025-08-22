"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { WalletIcon, ChallengeIcon, MiningIcon, FriendsIcon, ProfileIcon, LeaderboardIcon } from "../components/Icons";

export default function Page(){
  const [username, setUsername] = useState("IVANNIKOV.PRO");
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [totalPoints, setTotalPoints] = useState(1273.926);
  const [balance, setBalance] = useState(12.85);
  const [storage, setStorage] = useState(0.195942);
  const [lastClaim, setLastClaim] = useState(() => {
    const s = typeof window !== 'undefined' && window.localStorage.getItem("lastClaim");
    return s ? parseInt(s) : 0;
  });

  // Mock user fetch
  useEffect(()=>{
    fetch("/api/user").then(r=>r.json()).then(({user})=>{
      setUsername(user.username);
      setAvatarUrl(user.profilePic);
      setTotalPoints(user.totalPoints);
    });
  },[]);

  const FOUR_HOURS = 4*60*60*1000;
  const now = Date.now();
  const nextAt = lastClaim ? lastClaim + FOUR_HOURS : 0;
  const remaining = Math.max(0, nextAt - now);
  const remainingParts = useMemo(()=>{
    const sec = Math.ceil(remaining/1000);
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = sec%60;
    return {h,m,s};
  }, [remaining]);

  useEffect(()=>{
    const t = setInterval(()=>{}, 1000);
    return ()=> clearInterval(t);
  }, []);

  const claim = async ()=>{
    if(remaining>0) return;
    const res = await fetch("/api/claim", { method:"POST" });
    const data = await res.json();
    if(data?.success){
      setBalance(b=> Number((b + storage).toFixed(6)));
      setStorage(0);
      setTotalPoints(t=> Number((t + data.reward).toFixed(3)));
      const ts = Date.now();
      setLastClaim(ts);
      if (typeof window !== 'undefined') localStorage.setItem("lastClaim", String(ts));
    }
  };

  // Dial geometry
  const size = 260;
  const stroke = 12;
  const r = (size - stroke)/2;
  const circ = 2*Math.PI*r;
  const cap = 1.0;
  const progress = Math.min(1, storage/cap);
  const dash = circ * progress;

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background orbit and planets (subtle like first mockup) */}
      <div className="absolute inset-0 orbits">
        <div className="absolute left-6 top-36 w-6 h-6 rounded-full bg-orange-400/80 planet animate-floaty"></div>
        <div className="absolute right-10 top-64 w-3 h-3 rounded-full bg-fuchsia-400/80 planet animate-floaty" style={{animationDelay:"-1.5s"}}></div>
        <div className="absolute right-6 bottom-56 w-8 h-8 rounded-full bg-cyan-400/70 planet animate-floaty" style={{animationDelay:"-2.4s"}}></div>
      </div>

      {/* Header mimic */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button className="text-white/70">Cancel</button>
        <div className="text-center">
          <p className="text-sm text-white/70 tracking-widest">ROAR.MINING</p>
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
            <p className="text-[12px] text-cyan-300">Total: <span className="text-white">{totalPoints.toLocaleString()} ROAR</span></p>
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
          <svg width={size} height={size}>
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
              </radialGradient>
            </defs>
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="rgba(0,0,0,.6)"/>
            <circle cx={size/2} cy={size/2} r={r} stroke="url(#glow)" strokeWidth={stroke} fill="none"
              strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ filter: "drop-shadow(0 0 12px rgba(43,209,255,.8))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-white/70 text-sm">In storage:</p>
            <p className="text-4xl font-extrabold drop-shadow-[0_0_30px_rgba(103,232,249,0.85)]">{storage.toFixed(6)}</p>
            <div className="mt-2 text-[13px]">
              <p className="text-cyan-300 font-medium">Balance: <span className="text-white">{balance.toFixed(2)} ROAR</span></p>
            </div>
            <p className="mt-1 text-[12px] text-cyan-200/80 tracking-widest">Fill: {remaining>0 ? `${remainingParts.h}H : ${String(remainingParts.m).padStart(2,"0")}M : ${String(remainingParts.s).padStart(2,"0")}S` : "READY"}</p>
          </div>
        </motion.div>

        {/* rate chip */}
        <div className="mt-3 px-4 py-2 rounded-xl glass text-[13px]">
          <span className="align-middle">⚡</span> <span>0.01 ROAR/hour</span>
        </div>

        {/* Claim button - solid (first mockup look) with tap feedback */}
        <motion.button
          whileTap={{ scale: remaining>0 ? 1 : 0.98 }}
          onClick={claim}
          disabled={remaining>0}
          className={`mt-5 w-72 py-3 rounded-2xl font-semibold shadow-glow transition
            ${remaining>0 ? "bg-slate-700/80 text-white/60" : "bg-sky-600 hover:bg-sky-500 text-white"}`}
        >
          Claim ROAR
        </motion.button>
      </div>

      {/* Bottom nav - first mockup style but required order */}
      <div className="fixed bottom-6 left-0 right-0 px-5">
        <div className="mx-auto max-w-sm glass rounded-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <ProfileIcon className="mb-1" />
            <span>Profile</span>
          </div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <LeaderboardIcon className="mb-1" />
            <span>Leaderboard</span>
          </div>
          <div className="relative -mt-8">
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-glow">
              <MiningIcon className="text-cyan-300" />
            </div>
            <p className="text-center text-[11px] mt-1 text-cyan-300">Mining</p>
          </div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <ChallengeIcon className="mb-1" />
            <span>Challenges</span>
          </div>
          <div className="flex flex-col items-center text-white/70 text-[11px]">
            <WalletIcon className="mb-1" />
            <span>Wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
