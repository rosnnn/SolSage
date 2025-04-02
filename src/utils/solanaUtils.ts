import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";

interface SolanaProvider {
  isPhantom?: boolean;
  publicKey: PublicKey | { toString: () => string };
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

export const createToken = async (
  connection: Connection,
  wallet: SolanaProvider,
  publicKey: PublicKey,
  metadata: TokenMetadata
) => {
  try {
    // Check SOL balance
    const balance = await connection.getBalance(publicKey);
    const minBalance = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
    const feeEstimate = 0.01 * 1e9; // Rough estimate: 0.01 SOL for fees
    if (balance < minBalance + feeEstimate) {
      throw new Error(
        `Insufficient SOL balance: ${balance / 1e9} SOL. Need at least ${(minBalance + feeEstimate) / 1e9} SOL on Devnet.`
      );
    }

    // Generate a new keypair for the mint
    const mintKeypair = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

    // Create a transaction
    const transaction = new Transaction();

    // Fetch a fresh blockhash with lastValidBlockHeight
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        metadata.decimals,
        publicKey,
        null,
        TOKEN_PROGRAM_ID
      )
    );

    // Sign the transaction with the mint keypair
    transaction.partialSign(mintKeypair);

    // Sign the transaction with the wallet
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false, // Run preflight checks
      maxRetries: 5, // Retry up to 5 times
    });

    // Confirm the transaction with commitment as second argument
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed" // Moved commitment here
    );

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
    }

    console.log("Token created successfully. Signature:", signature);
    return mintKeypair.publicKey;
  } catch (error) {
    console.error("Token creation failed:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create token. Check console for details.");
  }
};

export const getOrCreateAssociatedTokenAccount = async (
  connection: Connection,
  wallet: SolanaProvider,
  publicKey: PublicKey,
  mint: PublicKey,
  owner: PublicKey
) => {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);

    try {
      const account = await getAccount(connection, associatedTokenAddress);
      return account;
    } catch (error) {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          owner,
          mint
        )
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        maxRetries: 5,
      });

      // Confirm the transaction with commitment as second argument
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed" // Moved commitment here
      );

      return await getAccount(connection, associatedTokenAddress);
    }
  } catch (error) {
    console.error("Failed to get or create associated token account:", error);
    throw new Error("Failed to get or create associated token account.");
  }
};