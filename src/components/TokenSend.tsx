import { useState } from "react";
import { useSolana } from "../context/SolanaContext";
import { createTransferInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "../utils/solanaUtils";
import { LoadingSpinner } from "./LoadingSpinner";

export const TokenSend = () => {
  const { wallet, publicKey, connection } = useSolana();
  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSend = async () => {
    if (!wallet || !publicKey || !mintAddress || !recipient || !amount) {
      setError("❌ Connect wallet and fill all fields!");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("❌ Please enter a valid amount!");
      return;
    }

    let recipientPubKey: PublicKey;
    try {
      recipientPubKey = new PublicKey(recipient);
    } catch (err) {
      setError("❌ Invalid recipient address!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const mint = new PublicKey(mintAddress);
      const sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        publicKey,
        mint,
        publicKey
      );
      const destAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        publicKey,
        mint,
        recipientPubKey
      );

      const transaction = new Transaction().add(
        createTransferInstruction(
          sourceAccount.address,
          destAccount.address,
          publicKey,
          BigInt(amountNum * 10 ** 6)
        )
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      setSuccess(
        `✅ Sent ${amountNum} tokens from ${sourceAccount.address.toString().slice(0, 8)}... to ${recipientPubKey.toString().slice(0, 8)}... (Mint: ${mintAddress.slice(0, 8)}...)`
      );
    } catch (err: any) {
      setError(`❌ Error during token transfer: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] moshpit p-6 text-white rounded-xl mx-auto mt-6">
      <div className="p-4 border-b border-[rgba(255,255,255,0.1)] flex items-center">
        <h2 className="text-xl font-bold flex items-center">📤 Send Tokens</h2>
      </div>

      <div className="p-6">
        <input
          type="text"
          placeholder="Token Mint Address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          className="w-full p-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
        />

        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 mt-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mt-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg text-white focus:outline-none transition"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full mt-4 px-6 py-3 bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] text-white font-semibold rounded-lg transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#629677] focus:bg-[#629677] focus:shadow-[0_0_0_2px_rgba(103,110,103,0.71)]"
          }`}
        >
          {loading ? <LoadingSpinner /> : "Send Tokens"}
        </button>
      </div>

      {success && (
        <div className="m-4 p-3 text-white bg-[rgba(0,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)] flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-sm text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="m-4 p-3 text-white bg-[rgba(255,0,0,0.22)] border-[2px] border-[#38363654] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.48)] flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};