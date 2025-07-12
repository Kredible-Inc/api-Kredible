import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId:
          this.configService.get("FIREBASE_PROJECT_ID") || "your-project-id",
      });
    }

    this.firestore = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  // Platform operations
  async createPlatform(platformData: any): Promise<any> {
    const docRef = await this.firestore
      .collection("platforms")
      .add(platformData);
    return { id: docRef.id, ...platformData };
  }

  async getPlatformByApiKey(apiKey: string): Promise<any> {
    const snapshot = await this.firestore
      .collection("platforms")
      .where("apiKey", "==", apiKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // User operations
  async createUser(userData: any): Promise<any> {
    const docRef = await this.firestore.collection("users").add(userData);
    return { id: docRef.id, ...userData };
  }

  async getUserByWalletAddress(walletAddress: string): Promise<any> {
    const snapshot = await this.firestore
      .collection("users")
      .where("walletAddress", "==", walletAddress)
      .limit(1)
      .get();

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
    await this.firestore.collection("queries").add(queryData);
  }

  // Statistics
  async getPlatformStats(platformId: string): Promise<any> {
    const snapshot = await this.firestore
      .collection("queries")
      .where("platformId", "==", platformId)
      .get();

    return {
      totalQueries: snapshot.size,
      queries: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  }

  async getAllStats(): Promise<any> {
    const platformsSnapshot = await this.firestore
      .collection("platforms")
      .get();
    const queriesSnapshot = await this.firestore.collection("queries").get();

    return {
      totalPlatforms: platformsSnapshot.size,
      totalQueries: queriesSnapshot.size,
      platforms: platformsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  }
}
