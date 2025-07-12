import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../../firebase/firebase.service";

@Injectable()
export class PlanService {
  constructor(private firebaseService: FirebaseService) {}

  async getPlan(platformId: string): Promise<any> {
    const platform = await this.firebaseService.getPlatformByApiKey(platformId);
    return platform?.plan || null;
  }

  async updatePlan(
    platformId: string,
    planType: "basic" | "premium" | "enterprise"
  ): Promise<any> {
    const plans = {
      basic: {
        type: "basic",
        monthlyQueries: 1000,
        remainingQueries: 1000,
        price: 99,
      },
      premium: {
        type: "premium",
        monthlyQueries: 10000,
        remainingQueries: 10000,
        price: 299,
      },
      enterprise: {
        type: "enterprise",
        monthlyQueries: 100000,
        remainingQueries: 100000,
        price: 999,
      },
    };

    // TODO: Implement plan update in Firebase
    return { platformId, plan: plans[planType] };
  }

  async decrementQueries(platformId: string): Promise<boolean> {
    // TODO: Implement query decrement in Firebase
    return true;
  }

  async resetMonthlyQueries(): Promise<void> {
    // TODO: Implement monthly reset for all platforms
  }
}
