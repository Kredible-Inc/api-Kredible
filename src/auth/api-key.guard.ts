import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
      throw new UnauthorizedException("API Key is required");
    }

    const platform = await this.firebaseService.getPlatformByApiKey(apiKey);

    if (!platform) {
      throw new UnauthorizedException("Invalid API Key");
    }

    // Check if platform has remaining queries
    if (platform.plan && platform.plan.remainingQueries <= 0) {
      throw new UnauthorizedException("No remaining queries in plan");
    }

    // Attach platform info to request for later use
    request["platform"] = platform;

    return true;
  }
}
