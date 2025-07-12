import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";
import { StatsService } from "./stats.service";
import { AdminKeyGuard } from "../../auth/admin-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

@ApiTags("stats")
@Controller("stats")
@UseGuards(AdminKeyGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: "Get global statistics" })
  @ApiHeader({ name: "x-admin-key", description: "Admin key" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid admin key" })
  async getGlobalStats(): Promise<ApiResponseDto<any>> {
    const stats = await this.statsService.getGlobalStats();

    return new ApiResponseDto(
      true,
      "Global statistics retrieved successfully",
      stats
    );
  }

  @Get("usage")
  @ApiOperation({ summary: "Get usage statistics" })
  @ApiResponse({
    status: 200,
    description: "Usage statistics retrieved successfully",
  })
  async getUsageStats(): Promise<ApiResponseDto<any>> {
    const stats = await this.statsService.getUsageStats();

    return new ApiResponseDto(
      true,
      "Usage statistics retrieved successfully",
      stats
    );
  }

  @Get("revenue")
  @ApiOperation({ summary: "Get revenue statistics" })
  @ApiResponse({
    status: 200,
    description: "Revenue statistics retrieved successfully",
  })
  async getRevenueStats(): Promise<ApiResponseDto<any>> {
    const stats = await this.statsService.getRevenueStats();

    return new ApiResponseDto(
      true,
      "Revenue statistics retrieved successfully",
      stats
    );
  }

  @Get("platform/:platformId")
  @ApiOperation({ summary: "Get platform statistics" })
  @ApiResponse({
    status: 200,
    description: "Platform statistics retrieved successfully",
  })
  async getPlatformStats(
    @Param("platformId") platformId: string
  ): Promise<ApiResponseDto<any>> {
    const stats = await this.statsService.getPlatformStats(platformId);

    return new ApiResponseDto(
      true,
      "Platform statistics retrieved successfully",
      stats
    );
  }
}
