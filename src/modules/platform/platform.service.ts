import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../../firebase/firebase.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PlatformService {
  constructor(private firebaseService: FirebaseService) {}

  async createPlatform(platformData: {
    name: string;
    description?: string;
    contactEmail: string;
    planType: "basic" | "premium" | "enterprise";
  }): Promise<any> {
    const apiKey = uuidv4();
    const plan = this.getDefaultPlan(platformData.planType);

    const platform = {
      ...platformData,
      apiKey,
      plan,
      createdAt: new Date(),
      isActive: true,
    };

    return await this.firebaseService.createPlatform(platform);
  }

  async getPlatformByApiKey(apiKey: string): Promise<any> {
    return await this.firebaseService.getPlatformByApiKey(apiKey);
  }

  async updatePlatformPlan(
    platformId: string,
    planType: "basic" | "premium" | "enterprise"
  ): Promise<any> {
    const plan = this.getDefaultPlan(planType);
    // TODO: Implement plan update in Firebase
    return { platformId, plan };
  }

  private getDefaultPlan(planType: "basic" | "premium" | "enterprise") {
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

    return plans[planType];
  }
}
