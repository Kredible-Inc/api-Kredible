import { db } from "../config/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export interface QueryLog {
  id?: string;
  platformId: string;
  walletAddress: string;
  timestamp: Date;
  score?: number;
  createdAt?: any;
}

const queriesCollection = () => collection(db, "queries");

export const logQuery = async (
  queryData: Omit<QueryLog, "id" | "createdAt">
): Promise<void> => {
  await addDoc(queriesCollection(), {
    ...queryData,
    createdAt: serverTimestamp(),
  });
};

export const getPlatformQueries = async (
  platformId: string
): Promise<QueryLog[]> => {
  const queriesQuery = query(
    queriesCollection(),
    where("platformId", "==", platformId)
  );
  const snapshot = await getDocs(queriesQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as QueryLog[];
};

export const getUserQueries = async (
  walletAddress: string
): Promise<QueryLog[]> => {
  const queriesQuery = query(
    queriesCollection(),
    where("walletAddress", "==", walletAddress)
  );
  const snapshot = await getDocs(queriesQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as QueryLog[];
};

export const getAllQueries = async (): Promise<QueryLog[]> => {
  const snapshot = await getDocs(queriesCollection());
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as QueryLog[];
};
