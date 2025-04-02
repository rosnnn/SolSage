import { useEffect, useState } from "react";
import { useSolana } from "../context/SolanaContext";

export const WalletConnect = () => {
  const { wallet, publicKey, balance, connectWallet, disconnectWallet, fetchBalance } = useSolana();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
      setSuccess(`✅ Wallet Connected: ${publicKey.toString().slice(0, 8)}...`);
    }
  }, [publicKey, fetchBalance]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      setError("❌ Failed to connect wallet!");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setSuccess(null);
      setError(null);
    } catch (err) {
      setError("❌ Failed to disconnect wallet!");
    }
  };

  return (
    <div className="w-full max-w-[600px] moshpit p-6 text-white rounded-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold flex items-center">🔗 Wallet Connection</h2>

      {!wallet ? (
        <button
          onClick={handleConnect}
          className="w-full mt-4 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition hover:bg-[#629677] focus:bg-[#629677] focus:shadow-[0_0_0_2px_rgba(103,110,103,0.71)]"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mt-4 p-4 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg">
          <p className="text-white">
            <span className="font-semibold">Wallet:</span>{" "}
            {publicKey?.toString().slice(0, 8)}...
          </p>
          <p className="text-white mt-1">
            <span className="font-semibold">Balance:</span> {balance} SOL
          </p>
          <button
            onClick={handleDisconnect}
            className="w-full mt-4 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition hover:bg-[#ff4d4d] focus:bg-[#ff4d4d] focus:shadow-[0_0_0_2px_rgba(103,110,103,0.71)]"
          >
            Disconnect
          </button>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 text-white bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)] flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-sm text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 text-white bg-[rgba(255,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)] flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};