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
  getDoc,
} from "firebase/firestore";

export interface Platform {
  id?: string;
  name: string;
  description?: string;
  contactEmail: string;
  planType: "basic" | "premium" | "enterprise";
  apiKey?: string;
  createdAt?: any;
  updatedAt?: any;
}

const platformsCollection = () => collection(db, "platforms");

export const createPlatform = async (platform: Platform): Promise<Platform> => {
  // Check if platform with same name already exists
  const platformsQuery = query(
    platformsCollection(),
    where("name", "==", platform.name)
  );
  const existingPlatforms = await getDocs(platformsQuery);

  if (!existingPlatforms.empty) {
    throw new Error("A platform with this name already exists");
  }

  const docRef = await addDoc(platformsCollection(), {
    ...platform,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...platform };
};

export const getPlatformById = async (
  platformId: string
): Promise<Platform | null> => {
  const docRef = doc(db, "platforms", platformId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as Platform;
};

export const getPlatformByApiKey = async (
  apiKey: string
): Promise<Platform | null> => {
  const platformsQuery = query(
    platformsCollection(),
    where("apiKey", "==", apiKey),
    limit(1)
  );
  const snapshot = await getDocs(platformsQuery);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Platform;
};

export const getAllPlatforms = async (): Promise<Platform[]> => {
  const snapshot = await getDocs(platformsCollection());
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Platform[];
};

export const updatePlatform = async (
  platformId: string,
  data: Partial<Platform>
): Promise<void> => {
  // If name is being updated, check if it already exists
  if (data.name) {
    const platformsQuery = query(
      platformsCollection(),
      where("name", "==", data.name)
    );
    const existingPlatforms = await getDocs(platformsQuery);
    const existingPlatform = existingPlatforms.docs.find(
      (doc) => doc.id !== platformId
    );

    if (existingPlatform) {
      throw new Error("A platform with this name already exists");
    }
  }

  const docRef = doc(db, "platforms", platformId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deletePlatform = async (platformId: string): Promise<void> => {
  const docRef = doc(db, "platforms", platformId);
  await deleteDoc(docRef);
};

// Helper function to generate API key
const generateApiKey = (): string => {
  return `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};
