import { db } from "../firebaseConfig";
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch, query, where } from "firebase/firestore";
import { BankAccount, Transaction, StockHolding, User } from "../types";
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_STOCKS } from "../constants";

// Helper to get collection references
const getUsersRef = () => collection(db, "users");
const getAccountsRef = (userId: string) => collection(db, "users", userId, "accounts");
const getTransactionsRef = (userId: string) => collection(db, "users", userId, "transactions");
const getStocksRef = (userId: string) => collection(db, "users", userId, "stocks");

export const dbService = {
  // 初始化用戶資料 (如果是新用戶，寫入種子資料)
  initializeUser: async (user: User) => {
    const userDocRef = doc(db, "users", user.id);
    // 更新用戶基本資料
    await setDoc(userDocRef, user, { merge: true });

    // 檢查是否有帳戶資料，若無則寫入預設資料
    const accountsSnapshot = await getDocs(getAccountsRef(user.id));
    if (accountsSnapshot.empty) {
      console.log("New user detected, seeding data...");
      const batch = writeBatch(db);
      
      INITIAL_ACCOUNTS.forEach(acc => {
        const ref = doc(db, "users", user.id, "accounts", acc.id);
        batch.set(ref, acc);
      });
      
      INITIAL_TRANSACTIONS.forEach(tx => {
        const ref = doc(db, "users", user.id, "transactions", tx.id);
        batch.set(ref, tx);
      });

      INITIAL_STOCKS.forEach(stock => {
        const ref = doc(db, "users", user.id, "stocks", stock.id);
        batch.set(ref, stock);
      });

      await batch.commit();
      return true; // Indicates data was seeded
    }
    return false;
  },

  // 讀取所有資料
  fetchAllData: async (userId: string) => {
    const [accSnap, txSnap, stockSnap] = await Promise.all([
      getDocs(getAccountsRef(userId)),
      getDocs(getTransactionsRef(userId)),
      getDocs(getStocksRef(userId))
    ]);

    return {
      accounts: accSnap.docs.map(d => d.data() as BankAccount),
      transactions: txSnap.docs.map(d => d.data() as Transaction).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      stocks: stockSnap.docs.map(d => d.data() as StockHolding)
    };
  },

  // Accounts CRUD
  saveAccount: async (userId: string, account: BankAccount) => {
    await setDoc(doc(db, "users", userId, "accounts", account.id), account);
  },
  deleteAccount: async (userId: string, accountId: string) => {
    await deleteDoc(doc(db, "users", userId, "accounts", accountId));
  },

  // Transactions CRUD
  saveTransaction: async (userId: string, transaction: Transaction) => {
    await setDoc(doc(db, "users", userId, "transactions", transaction.id), transaction);
  },
  // Note: deleting transaction typically requires reverting balance, handling in UI/Business Logic layer for simplicity here

  // Stocks CRUD
  saveStock: async (userId: string, stock: StockHolding) => {
    await setDoc(doc(db, "users", userId, "stocks", stock.id), stock);
  },
  
  // Update Account Balance (helper)
  updateAccountBalance: async (userId: string, accountId: string, newBalance: number) => {
    await setDoc(doc(db, "users", userId, "accounts", accountId), { balance: newBalance }, { merge: true });
  }
};
