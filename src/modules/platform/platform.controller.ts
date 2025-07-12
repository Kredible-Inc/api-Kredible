import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { PlatformService } from "./platform.service";
import { AdminKeyGuard } from "../../auth/admin-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

class CreatePlatformDto {
  name: string;
  description?: string;
  contactEmail: string;
  planType: "basic" | "premium" | "enterprise";
}

@ApiTags("platforms")
@Controller("platforms")
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  @Post()
  @UseGuards(AdminKeyGuard)
  @ApiOperation({ summary: "Create a new platform" })
  @ApiBody({ type: CreatePlatformDto })
  @ApiResponse({
    status: 201,
    description: "Platform created successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            apiKey: { type: "string" },
            plan: { type: "object" },
          },
        },
        timestamp: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid admin key" })
  async createPlatform(
    @Body() createPlatformDto: CreatePlatformDto
  ): Promise<ApiResponseDto<any>> {
    const platform =
      await this.platformService.createPlatform(createPlatformDto);

    return new ApiResponseDto(true, "Platform created successfully", platform);
  }
}
