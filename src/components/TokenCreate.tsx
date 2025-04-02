import { useState } from "react";
import { useSolana } from "../context/SolanaContext";
import { createToken } from "../utils/solanaUtils";
import { useNavigate } from "react-router-dom";

export const TokenCreate = () => {
  const { wallet, publicKey, connection } = useSolana();
  const [loading, setLoading] = useState(false);
  const [tokenMint, setTokenMint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const navigate = useNavigate();

  const handleCreateToken = async () => {
    if (!wallet || !publicKey) {
      setError("❌ Please connect your wallet!");
      return;
    }
    if (!tokenName || !tokenSymbol || !decimals) {
      setError("❌ Please fill all token details!");
      return;
    }
    const decimalsNum = parseInt(decimals);
    if (isNaN(decimalsNum) || decimalsNum < 0 || decimalsNum > 9) {
      setError("❌ Decimals must be between 0 and 9!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mint = await createToken(connection, wallet, publicKey, {
        name: tokenName,
        symbol: tokenSymbol,
        decimals: decimalsNum,
      });
      setTokenMint(mint.toString());
    } catch (err) {
      setError("❌ Token creation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToMint = () => {
    if (tokenMint) {
      navigate("/mint-token");
    }
  };

  return (
    <div className="moshpit p-6 text-white rounded-xl">
      <h2 className="text-2xl font-bold">🚀 Create Token</h2>

      <input
        type="text"
        placeholder="Token Name (e.g., MyToken)"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        className="w-full mt-3 p-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
      />
      <input
        type="text"
        placeholder="Token Symbol (e.g., MTK)"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        className="w-full mt-3 p-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
      />
      <input
        type="number"
        placeholder="Decimals (0-9)"
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
        className="w-full mt-3 p-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
      />

      <button
        onClick={handleCreateToken}
        className="w-full mt-4 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition hover:bg-[#629677] focus:bg-[#629677] focus:shadow-[0_0_0_2px_rgba(103,110,103,0.71)]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
            Processing...
          </div>
        ) : (
          "Create Token"
        )}
      </button>

      {tokenMint && (
        <div className="mt-4">
          <p className="p-3 text-white bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)]">
            ✅ Token Created: {tokenMint}
          </p>
          <button
            onClick={handleNavigateToMint}
            className="w-full mt-3 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition hover:bg-[#629677]"
          >
            Mint This Token
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 p-3 text-white bg-[rgba(255,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)]">
          {error}
        </p>
      )}

      <button
        onClick={() => navigate("/")}
        className="w-full mt-4 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition hover:bg-[#629677]"
      >
        Back to Wallet
      </button>
    </div>
  );
};