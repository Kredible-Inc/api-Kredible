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

export interface Plan {
  id?: string;
  platformId: string;
  planType: "basic" | "premium" | "enterprise";
  features: string[];
  price: number;
  maxQueries: number;
  createdAt?: any;
  updatedAt?: any;
}

const plansCollection = () => collection(db, "plans");

export const createPlan = async (plan: Plan): Promise<Plan> => {
  // Check if plan for this platform already exists
  const plansQuery = query(
    plansCollection(),
    where("platformId", "==", plan.platformId)
  );
  const existingPlans = await getDocs(plansQuery);

  if (!existingPlans.empty) {
    throw new Error("A plan for this platform already exists");
  }

  const docRef = await addDoc(plansCollection(), {
    ...plan,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...plan };
};

export const getPlanByPlatformId = async (
  platformId: string
): Promise<Plan | null> => {
  const plansQuery = query(
    plansCollection(),
    where("platformId", "==", platformId),
    limit(1)
  );
  const snapshot = await getDocs(plansQuery);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Plan;
};

export const getAllPlans = async (): Promise<Plan[]> => {
  const snapshot = await getDocs(plansCollection());
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Plan[];
};

export const updatePlan = async (
  planId: string,
  data: Partial<Plan>
): Promise<void> => {
  const docRef = doc(db, "plans", planId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deletePlan = async (planId: string): Promise<void> => {
  const docRef = doc(db, "plans", planId);
  await deleteDoc(docRef);
};

// Default plan configurations
export const getDefaultPlans = () => ({
  basic: {
    planType: "basic" as const,
    features: ["Basic credit score", "Limited queries", "Email support"],
    price: 50,
    maxQueries: 1000,
  },
  premium: {
    planType: "premium" as const,
    features: [
      "Advanced credit score",
      "Unlimited queries",
      "Priority support",
      "Analytics",
    ],
    price: 150,
    maxQueries: 10000,
  },
  enterprise: {
    planType: "enterprise" as const,
    features: [
      "Custom credit score",
      "Unlimited queries",
      "Dedicated support",
      "Advanced analytics",
      "API access",
    ],
    price: 500,
    maxQueries: -1, // Unlimited
  },
});
