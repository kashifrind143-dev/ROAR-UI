"use client";
import { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

export default function Dashboard() {
  const [tonConnectUI, wallet] = useTonConnectUI();
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (wallet?.address) {
        try {
          const response = await fetch(`/api/user?username=${wallet.address}`);
          const data = await response.json();
          setUserData(data);
          setBalance(data.balance || 0);

          const now = Date.now();
          const lastClaim = data.lastClaim || 0;
          const timeSinceLastClaim = now - lastClaim;
          const fourHours = 4 * 60 * 60 * 1000;

          if (timeSinceLastClaim < fourHours) {
            const remainingTime = fourHours - timeSinceLastClaim;
            setTimeLeft(remainingTime);
            setCanClaim(false);
          } else {
            setCanClaim(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [wallet]);

  useEffect(() => {
    let intervalId;

    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000);
      }, 1000);
    } else {
      setCanClaim(true);
    }

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleClaimReward = async () => {
    try {
      const response = await fetch('/api/claimReward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: wallet.address }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        setTimeLeft(4 * 60 * 60 * 1000);
        setCanClaim(false);
      } else {
        console.error('Failed to claim reward:', data.message);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const formatTimeLeft = (ms) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {userData && (
        <div className="flex items-center mb-4">
          {userData.photo_url && (
            <img
              src={userData.photo_url}
              alt="Telegram Profile"
              className="rounded-full w-12 h-12 mr-4"
            />
          )}
          <div>
            <p>Telegram: @{userData.username}</p>
            <p>Wallet: {wallet?.address}</p>
            <p>Balance: {balance} ROAR</p>
          </div>
        </div>
      )}

      {canClaim ? (
        <button
          onClick={handleClaimReward}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Claim Reward (+10 ROAR)
        </button>
      ) : (
        <p>Claim again in: {formatTimeLeft(timeLeft)}</p>
      )}
    </div>
  );
}
