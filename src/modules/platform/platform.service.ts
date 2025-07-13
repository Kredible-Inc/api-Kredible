import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  createPlatform,
  getPlatformByApiKey,
  updatePlatform,
  getPlatformById,
  getPlatformsByOwnerAddress,
} from "../../services/platform.service";
import { Platform } from "../../services/platform.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PlatformService {
  async createPlatform(platformData: {
    name: string;
    description?: string;
    contactEmail: string;
    ownerAddress: string;
    planType: "basic" | "premium" | "enterprise";
  }): Promise<any> {
    // Create platform without API key initially
    const platform: Platform = {
      name: platformData.name,
      description: platformData.description,
      contactEmail: platformData.contactEmail,
      ownerAddress: platformData.ownerAddress,
      planType: platformData.planType,
    };

    const createdPlatform = await createPlatform(platform);

    // Return platform without API key
    return {
      id: createdPlatform.id,
      name: createdPlatform.name,
      description: createdPlatform.description,
      contactEmail: createdPlatform.contactEmail,
      ownerAddress: createdPlatform.ownerAddress,
      planType: createdPlatform.planType,
    };
  }

  async getPlatformsByOwnerAddress(ownerAddress: string): Promise<any[]> {
    const platforms = await getPlatformsByOwnerAddress(ownerAddress);

    return platforms.map((platform) => ({
      id: platform.id,
      name: platform.name,
      description: platform.description,
      contactEmail: platform.contactEmail,
      ownerAddress: platform.ownerAddress,
      planType: platform.planType,
      hasApiKey: !!platform.apiKey,
    }));
  }

  async getApiKey(platformId: string, contactEmail: string): Promise<any> {
    // Get platform by ID
    const platform = await getPlatformById(platformId);

    if (!platform) {
      throw new NotFoundException("Platform not found");
    }

    // Verify contact email matches
    if (platform.contactEmail !== contactEmail) {
      throw new UnauthorizedException("Invalid contact email");
    }

    // Generate API key if it doesn't exist
    if (!platform.apiKey) {
      const apiKey = `pk_${uuidv4().replace(/-/g, "")}`;
      await updatePlatform(platformId, { apiKey });
      platform.apiKey = apiKey;
    }

    return {
      apiKey: platform.apiKey,
      platformId: platform.id,
      platformName: platform.name,
    };
  }

  async getPlatformByApiKey(apiKey: string): Promise<any> {
    return await getPlatformByApiKey(apiKey);
  }

  async updatePlatformPlan(
    platformId: string,
    planType: "basic" | "premium" | "enterprise"
  ): Promise<any> {
    const plan = this.getDefaultPlan(planType);
    await updatePlatform(platformId, { planType });
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
