import { db } from "../config/config";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAllPlatforms } from "./platform.service";
import { getAllQueries } from "./query.service";

const platformsCollection = () => collection(db, "platforms");
const queriesCollection = () => collection(db, "queries");

export interface PlatformStats {
  totalQueries: number;
  queries: any[];
}

export interface GlobalStats {
  totalPlatforms: number;
  totalQueries: number;
  platforms: any[];
}

export const getPlatformStats = async (
  platformId: string
): Promise<PlatformStats> => {
  const queriesQuery = query(
    queriesCollection(),
    where("platformId", "==", platformId)
  );
  const snapshot = await getDocs(queriesQuery);

  return {
    totalQueries: snapshot.size,
    queries: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
};

export const getAllStats = async (): Promise<GlobalStats> => {
  const platformsSnapshot = await getDocs(platformsCollection());
  const queriesSnapshot = await getDocs(queriesCollection());

  return {
    totalPlatforms: platformsSnapshot.size,
    totalQueries: queriesSnapshot.size,
    platforms: platformsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
  };
};

export const getUsageStats = async (): Promise<any> => {
  const platforms = await getAllPlatforms();
  const queries = await getAllQueries();

  // Calculate usage statistics
  const totalQueries = queries.length;
  const activePlatforms = platforms.filter((p) => p.createdAt);
  const averageQueriesPerPlatform =
    totalQueries / (activePlatforms.length || 1);

  return {
    totalQueries,
    activePlatforms: activePlatforms.length,
    averageQueriesPerPlatform:
      Math.round(averageQueriesPerPlatform * 100) / 100,
    queriesLast24h: queries.filter((q) => {
      const queryTime =
        q.timestamp instanceof Date ? q.timestamp : new Date(q.timestamp);
      const now = new Date();
      const diffHours =
        (now.getTime() - queryTime.getTime()) / (1000 * 60 * 60);
      return diffHours <= 24;
    }).length,
  };
};

export const getRevenueStats = async (): Promise<any> => {
  const platforms = await getAllPlatforms();

  // Calculate revenue based on plan types
  const planPricing = {
    basic: 50,
    premium: 150,
    enterprise: 500,
  };

  const revenueByPlan = platforms.reduce(
    (acc, platform) => {
      const plan = platform.planType || "basic";
      acc[plan] = (acc[plan] || 0) + (planPricing[plan] || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const totalRevenue = Object.values(revenueByPlan).reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  return {
    totalRevenue,
    revenueByPlan,
    platformCount: platforms.length,
  };
};
