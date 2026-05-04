/**
 * Account service — backed by Firebase Realtime Database
 * Path layout:
 *   accounts/{userId}/balance
 *   accounts/{userId}/totalDeposit
 *   accounts/{userId}/totalWithdrawal
 */
import { ref, get, set, update, increment } from "firebase/database";
import { rtdb } from "@/lib/firebase";

export interface AccountStats {
  balance: number;
  totalDeposit: number;
  totalWithdrawal: number;
}

const DEFAULT_STATS: AccountStats = {
  balance: 50000.00,
  totalDeposit: 50000.00,
  totalWithdrawal: 0.00,
};

export const getAccountStats = async (userId: string): Promise<AccountStats> => {
  try {
    const accountRef = ref(rtdb, `accounts/${userId}`);
    const snapshot = await get(accountRef);

    if (snapshot.exists()) {
      return snapshot.val() as AccountStats;
    } else {
      // First time — create the demo account with $50,000
      await set(accountRef, DEFAULT_STATS);
      return DEFAULT_STATS;
    }
  } catch (e) {
    console.error("Error getting account stats:", e);
    return DEFAULT_STATS;
  }
};

export const updateBalance = async (userId: string, delta: number) => {
  try {
    const accountRef = ref(rtdb, `accounts/${userId}`);
    await update(accountRef, { balance: increment(delta) });
  } catch (e) {
    console.error("Error updating balance:", e);
    throw e;
  }
};

export const processDeposit = async (userId: string, amount: number) => {
  try {
    const accountRef = ref(rtdb, `accounts/${userId}`);
    await update(accountRef, {
      balance: increment(amount),
      totalDeposit: increment(amount),
    });
  } catch (e) {
    console.error("Error processing deposit:", e);
    throw e;
  }
};

export const processWithdrawal = async (userId: string, amount: number) => {
  try {
    const accountRef = ref(rtdb, `accounts/${userId}`);
    // Verify sufficient balance first
    const snapshot = await get(accountRef);
    const current: AccountStats = snapshot.exists() ? snapshot.val() : DEFAULT_STATS;
    if (amount > current.balance) {
      throw new Error(`Insufficient demo balance. Available: $${current.balance.toFixed(2)}`);
    }
    await update(accountRef, {
      balance: increment(-amount),
      totalWithdrawal: increment(amount),
    });
  } catch (e) {
    console.error("Error processing withdrawal:", e);
    throw e;
  }
};
