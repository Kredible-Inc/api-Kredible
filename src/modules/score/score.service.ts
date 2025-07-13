import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../../firebase/firebase.service";
import { decrementQueries } from "../../services/plan.service";

@Injectable()
export class ScoreService {
  constructor(private firebaseService: FirebaseService) {}

  async calculateScore(walletAddress: string): Promise<number> {
    // TODO: Implement real score calculation based on:
    // - On-chain activity (transactions, tokens, etc.)
    // - Document uploads
    // - User behavior patterns
    // - Stellar network activity

    // For now, return a random score between 0 and 100
    const score = Math.floor(Math.random() * 101);

    return score;
  }

  async getScore(
    walletAddress: string,
    platformId: string
  ): Promise<{
    score: number;
    walletAddress: string;
    timestamp: string;
  }> {
    // Decrement remaining queries first
    const hasQueriesRemaining = await decrementQueries(platformId);

    if (!hasQueriesRemaining) {
      throw new Error("No remaining queries in plan");
    }

    const score = await this.calculateScore(walletAddress);

    // Log the query
    await this.firebaseService.logQuery({
      platformId,
      walletAddress,
      timestamp: new Date(),
      score,
    });

    return {
      score,
      walletAddress,
      timestamp: new Date().toISOString(),
    };
  }
}
