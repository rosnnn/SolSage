import { useState, useEffect, useCallback } from "react";
import { useSolana } from "../context/SolanaContext";
import { LoadingSpinner } from './LoadingSpinner';


export const TransactionHistory = () => {
  const { publicKey, connection } = useSolana();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });

      const txs = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getParsedTransaction(sig.signature, "confirmed");
          return tx ? { ...tx, signature: sig.signature } : null;
        })
      );

      setHistory(txs.filter((tx) => tx !== null));
    } catch (err) {
      setError("❌ Failed to fetch transaction history.");
      console.error("Transaction history fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="w-full max-w-lg moshpit p-6 text-white rounded-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold flex items-center">📜 Transaction History</h2>

      {loading && <p className="mt-4"><LoadingSpinner /></p>}
      {error && (
        <div className="mt-4 p-3 text-white bg-[rgba(255,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)] flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {history.length === 0 && !loading ? (
        <p className="mt-4 text-gray-400">No transactions found.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {history.map((tx, idx) => {
            const signature = tx.signature;
            const slot = tx.slot;
            const timestamp = tx?.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "Unknown Time";
            const instructions = tx?.transaction?.message?.instructions || [];
            const firstTransfer = instructions.find(
              (inst: any) => inst?.parsed?.type === "transfer"
            );

            return (
              <li key={idx} className="p-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg">
                <p>
                  <strong>Signature:</strong>{" "}
                  <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {signature.slice(0, 6)}...{signature.slice(-6)}
                  </a>
                </p>
                <p>
                  <strong>Slot:</strong> {slot}
                </p>
                <p>
                  <strong>Time:</strong> {timestamp}
                </p>
                {firstTransfer ? (
                  <>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {(Number(firstTransfer.parsed.info.amount) / 1e9).toFixed(4)} SOL
                    </p>
                    <p>
                      <strong>From:</strong>{" "}
                      {firstTransfer.parsed.info.source.slice(0, 6)}...
                      {firstTransfer.parsed.info.source.slice(-6)}
                    </p>
                    <p>
                      <strong>To:</strong>{" "}
                      {firstTransfer.parsed.info.destination.slice(0, 6)}...
                      {firstTransfer.parsed.info.destination.slice(-6)}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400">Non-transfer transaction</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};