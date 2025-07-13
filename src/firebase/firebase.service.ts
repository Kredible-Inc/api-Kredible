import { Injectable } from "@nestjs/common";
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

@Injectable()
export class FirebaseService {
  // Platform operations
  async createPlatform(platformData: any): Promise<any> {
    const docRef = await addDoc(collection(db, "platforms"), {
      ...platformData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...platformData };
  }

  async getPlatformByApiKey(apiKey: string): Promise<any> {
    const platformsQuery = query(
      collection(db, "platforms"),
      where("apiKey", "==", apiKey),
      limit(1)
    );
    const snapshot = await getDocs(platformsQuery);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // User operations
  async createUser(userData: any): Promise<any> {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...userData };
  }

  async getUserByWalletAddress(walletAddress: string): Promise<any> {
    const usersQuery = query(
      collection(db, "users"),
      where("walletAddress", "==", walletAddress),
      limit(1)
    );
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Query logging
  async logQuery(queryData: {
    platformId: string;
    walletAddress: string;
    timestamp: Date;
    score?: number;
  }): Promise<void> {
    await addDoc(collection(db, "queries"), {
      ...queryData,
      createdAt: serverTimestamp(),
    });
  }

  // Statistics
  async getPlatformStats(platformId: string): Promise<any> {
    const queriesQuery = query(
      collection(db, "queries"),
      where("platformId", "==", platformId)
    );
    const snapshot = await getDocs(queriesQuery);

    return {
      totalQueries: snapshot.size,
      queries: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  }

  async getAllStats(): Promise<any> {
    const platformsSnapshot = await getDocs(collection(db, "platforms"));
    const queriesSnapshot = await getDocs(collection(db, "queries"));

    return {
      totalPlatforms: platformsSnapshot.size,
      totalQueries: queriesSnapshot.size,
      platforms: platformsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  }

  // Update operations
  async updatePlatform(platformId: string, data: any): Promise<void> {
    const docRef = doc(db, "platforms", platformId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async updateUser(userId: string, data: any): Promise<void> {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete operations
  async deletePlatform(platformId: string): Promise<void> {
    const docRef = doc(db, "platforms", platformId);
    await deleteDoc(docRef);
  }

  async deleteUser(userId: string): Promise<void> {
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
  }
}
