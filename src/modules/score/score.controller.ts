import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from "@nestjs/swagger";
import { ScoreService } from "./score.service";
import { ApiKeyGuard } from "../../auth/api-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

@ApiTags("scores")
@Controller("score")
@UseGuards(ApiKeyGuard)
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get(":walletAddress")
  @ApiOperation({ summary: "Get credit score for a wallet address" })
  @ApiParam({ name: "walletAddress", description: "Stellar wallet address" })
  @ApiHeader({ name: "x-api-key", description: "Platform API key" })
  @ApiResponse({
    status: 200,
    description: "Credit score retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            score: { type: "number" },
            walletAddress: { type: "string" },
            timestamp: { type: "string" },
          },
        },
        timestamp: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid API key" })
  @ApiResponse({
    status: 429,
    description: "Too many requests - Plan limit exceeded",
  })
  async getScore(
    @Param("walletAddress") walletAddress: string,
    @Request() req: any
  ): Promise<ApiResponseDto<any>> {
    const platform = req.platform;
    const result = await this.scoreService.getScore(walletAddress, platform.id);

    return new ApiResponseDto(
      true,
      "Credit score retrieved successfully",
      result
    );
  }
}
