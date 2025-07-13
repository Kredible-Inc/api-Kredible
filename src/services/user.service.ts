import { db } from "../config/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  limit,
} from "firebase/firestore";

export interface User {
  id?: string;
  walletAddress: string;
  name?: string;
  email?: string;
  documents?: any[];
  activity?: any[];
  createdAt?: any;
  updatedAt?: any;
}

const usersCollection = () => collection(db, "users");

export const createUser = async (user: User): Promise<User> => {
  // Check if user with same wallet address already exists
  const usersQuery = query(
    usersCollection(),
    where("walletAddress", "==", user.walletAddress)
  );
  const existingUsers = await getDocs(usersQuery);

  if (!existingUsers.empty) {
    throw new Error("A user with this wallet address already exists");
  }

  const docRef = await addDoc(usersCollection(), {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...user };
};

export const getUserByWalletAddress = async (
  walletAddress: string
): Promise<User | null> => {
  const usersQuery = query(
    usersCollection(),
    where("walletAddress", "==", walletAddress),
    limit(1)
  );
  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
};

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(usersCollection());
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
};

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  // If wallet address is being updated, check if it already exists
  if (data.walletAddress) {
    const usersQuery = query(
      usersCollection(),
      where("walletAddress", "==", data.walletAddress)
    );
    const existingUsers = await getDocs(usersQuery);
    const existingUser = existingUsers.docs.find((doc) => doc.id !== userId);

    if (existingUser) {
      throw new Error("A user with this wallet address already exists");
    }
  }

  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  const docRef = doc(db, "users", userId);
  await deleteDoc(docRef);
};

export const addDocumentToUser = async (
  userId: string,
  document: any
): Promise<void> => {
  const user = await getUserByWalletAddress(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const documents = user.documents || [];
  documents.push({
    ...document,
    createdAt: serverTimestamp(),
  });

  const docRef = doc(db, "users", user.id!);
  await updateDoc(docRef, {
    documents,
    updatedAt: serverTimestamp(),
  });
};

export const addActivityToUser = async (
  userId: string,
  activity: any
): Promise<void> => {
  const user = await getUserByWalletAddress(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const activities = user.activity || [];
  activities.push({
    ...activity,
    timestamp: serverTimestamp(),
  });

  const docRef = doc(db, "users", user.id!);
  await updateDoc(docRef, {
    activity: activities,
    updatedAt: serverTimestamp(),
  });
};
