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
  increment,
} from "firebase/firestore";

export interface Plan {
  id?: string;
  platformId: string;
  planType: "free" | "premium" | "premium_pro";
  features: string[];
  price: number;
  maxQueries: number;
  remainingQueries: number;
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

// Decrement remaining queries for a platform
export const decrementQueries = async (
  platformId: string
): Promise<boolean> => {
  const plan = await getPlanByPlatformId(platformId);

  if (!plan) {
    throw new Error("Plan not found for platform");
  }

  if (plan.remainingQueries <= 0) {
    return false; // No queries remaining
  }

  const docRef = doc(db, "plans", plan.id!);
  await updateDoc(docRef, {
    remainingQueries: increment(-1),
    updatedAt: serverTimestamp(),
  });

  return true;
};

// Get plan usage statistics
export const getPlanUsage = async (platformId: string): Promise<any> => {
  const plan = await getPlanByPlatformId(platformId);

  if (!plan) {
    return null;
  }

  // Get total queries made by this platform
  const queriesQuery = query(
    collection(db, "queries"),
    where("platformId", "==", platformId)
  );
  const queriesSnapshot = await getDocs(queriesQuery);
  const totalQueries = queriesSnapshot.size;

  return {
    planType: plan.planType,
    maxQueries: plan.maxQueries,
    remainingQueries: plan.remainingQueries,
    usedQueries: totalQueries,
    usagePercentage:
      plan.maxQueries > 0
        ? Math.round((totalQueries / plan.maxQueries) * 100)
        : 0,
  };
};

// Reset monthly queries for all platforms
export const resetMonthlyQueries = async (): Promise<void> => {
  const plans = await getAllPlans();

  for (const plan of plans) {
    const defaultPlan = getDefaultPlans()[plan.planType];
    if (defaultPlan) {
      await updatePlan(plan.id!, {
        remainingQueries: defaultPlan.maxQueries,
      });
    }
  }
};

// Default plan configurations with new limits
export const getDefaultPlans = () => ({
  free: {
    planType: "free" as const,
    features: ["Basic credit score", "100 queries per month", "Email support"],
    price: 0,
    maxQueries: 100,
  },
  premium: {
    planType: "premium" as const,
    features: [
      "Advanced credit score",
      "1,000 queries per month",
      "Priority support",
      "Analytics",
    ],
    price: 50,
    maxQueries: 1000,
  },
  premium_pro: {
    planType: "premium_pro" as const,
    features: [
      "Custom credit score",
      "10,000 queries per month",
      "Dedicated support",
      "Advanced analytics",
      "API access",
    ],
    price: 150,
    maxQueries: 10000,
  },
});
