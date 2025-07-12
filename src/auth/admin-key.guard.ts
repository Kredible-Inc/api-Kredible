import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminKey = request.headers["x-admin-key"] as string;
    const expectedAdminKey = this.configService.get("ADMIN_KEY");

    if (!adminKey || adminKey !== expectedAdminKey) {
      throw new UnauthorizedException("Invalid admin key");
    }

    return true;
  }
}
