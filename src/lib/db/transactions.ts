/**
 * Transaction service — backed by Firebase Realtime Database
 * Path layout:
 *   transactions/{userId}/{txId}/...
 */
import { ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Transaction } from "@/types";

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  try {
    const txRef = ref(rtdb, `transactions/${transaction.userId}`);
    const newRef = await push(txRef, {
      ...transaction,
      date: transaction.date instanceof Date
        ? transaction.date.toISOString()
        : transaction.date,
    });
    return newRef.key as string;
  } catch (e) {
    console.error("Error adding transaction:", e);
    throw e;
  }
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    if (!userId) return [];

    const txRef = ref(rtdb, `transactions/${userId}`);
    const snapshot = await get(txRef);

    if (!snapshot.exists()) return [];

    const raw = snapshot.val() as Record<string, any>;

    const txs: Transaction[] = Object.entries(raw).map(([id, data]) => ({
      id,
      ...data,
      date: new Date(data.date),
    }));

    // Sort by date descending (newest first)
    txs.sort((a, b) => b.date.getTime() - a.date.getTime());

    return txs;
  } catch (e) {
    console.error("Error getting transactions:", e);
    return [];
  }
};

export const deleteTransaction = async (userId: string, transactionId: string): Promise<void> => {
  try {
    const { remove } = await import("firebase/database");
    const txRef = ref(rtdb, `transactions/${userId}/${transactionId}`);
    await remove(txRef);
  } catch (e) {
    console.error("Error deleting transaction:", e);
    throw e;
  }
};
