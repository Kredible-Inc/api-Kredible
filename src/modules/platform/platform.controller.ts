import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiHeader,
} from "@nestjs/swagger";
import { PlatformService } from "./platform.service";
import { AdminKeyGuard } from "../../auth/admin-key.guard";
import { ApiKeyGuard } from "../../auth/api-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { GetApiKeyDto } from "./dto/get-api-key.dto";
import { GetApiKeyByIdDto } from "./dto/get-api-key-by-id.dto";
import {
  PlatformResponseDto,
  ApiKeyResponseDto,
} from "./dto/platform-response.dto";
import { PlatformByOwnerDto } from "./dto/platforms-by-owner.dto";
import { PlatformUsageResponseDto } from "./dto/platform-usage.dto";

@ApiTags("platforms")
@Controller("platforms")
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new platform",
    description:
      "Creates a new platform without an API key. The API key can be obtained later using the platform ID and contact email.",
  })
  @ApiBody({ type: CreatePlatformDto })
  @ApiResponse({
    status: 201,
    description: "Platform created successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Platform created successfully" },
        data: {
          type: "object",
          properties: {
            id: { type: "string", example: "abc123def456" },
            name: { type: "string", example: "Mi Plataforma de Prueba" },
            description: {
              type: "string",
              example: "Una plataforma para probar la API de Kredible",
            },
            contactEmail: { type: "string", example: "admin@miplataforma.com" },
            ownerAddress: {
              type: "string",
              example:
                "GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
            },
            planType: { type: "string", example: "premium" },
          },
        },
        timestamp: { type: "string", example: "2025-07-12T23:30:00.000Z" },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Platform with this name already exists",
  })
  async createPlatform(
    @Body() createPlatformDto: CreatePlatformDto
  ): Promise<ApiResponseDto<PlatformResponseDto>> {
    const platform =
      await this.platformService.createPlatform(createPlatformDto);

    return new ApiResponseDto(true, "Platform created successfully", platform);
  }

  @Get("by-owner")
  @ApiOperation({
    summary: "Get platforms by owner address",
    description: "Retrieves all platforms owned by a specific wallet address",
  })
  @ApiQuery({
    name: "ownerAddress",
    description: "Wallet address of the platform owner",
    example: "GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
  })
  @ApiResponse({
    status: 200,
    description: "Platforms retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Platforms retrieved successfully",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "abc123def456" },
              name: { type: "string", example: "Mi Plataforma de Prueba" },
              description: {
                type: "string",
                example: "Una plataforma para probar la API de Kredible",
              },
              contactEmail: {
                type: "string",
                example: "admin@miplataforma.com",
              },
              ownerAddress: {
                type: "string",
                example:
                  "GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
              },
              planType: { type: "string", example: "premium" },
              hasApiKey: { type: "boolean", example: true },
            },
          },
        },
        timestamp: { type: "string", example: "2025-07-12T23:30:00.000Z" },
      },
    },
  })
  async getPlatformsByOwnerAddress(
    @Query("ownerAddress") ownerAddress: string
  ): Promise<ApiResponseDto<PlatformByOwnerDto[]>> {
    const platforms =
      await this.platformService.getPlatformsByOwnerAddress(ownerAddress);

    return new ApiResponseDto(
      true,
      "Platforms retrieved successfully",
      platforms
    );
  }

  @Get("usage")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: "Get platform usage information",
    description:
      "Retrieves current usage statistics for the authenticated platform",
  })
  @ApiHeader({ name: "x-api-key", description: "Platform API key" })
  @ApiResponse({
    status: 200,
    description: "Usage information retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Usage information retrieved successfully",
        },
        data: {
          type: "object",
          properties: {
            planType: { type: "string", example: "premium" },
            maxQueries: { type: "number", example: 1000 },
            remainingQueries: { type: "number", example: 750 },
            usedQueries: { type: "number", example: 250 },
            usagePercentage: { type: "number", example: 25 },
          },
        },
        timestamp: { type: "string", example: "2025-07-12T23:30:00.000Z" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid API key" })
  @ApiResponse({ status: 404, description: "No plan found for platform" })
  async getUsage(
    @Request() req: any
  ): Promise<ApiResponseDto<PlatformUsageResponseDto>> {
    const platform = req.platform;
    const usage = await this.platformService.getUsage(platform.id);

    return new ApiResponseDto(
      true,
      "Usage information retrieved successfully",
      usage
    );
  }

  @Post("api-key")
  @ApiOperation({
    summary: "Get API key for a platform",
    description:
      "Retrieves or generates an API key for a platform using the platform ID and contact email for verification.",
  })
  @ApiBody({ type: GetApiKeyDto })
  @ApiResponse({
    status: 200,
    description: "API key retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "API key retrieved successfully" },
        data: {
          type: "object",
          properties: {
            apiKey: { type: "string", example: "pk_abc123def456" },
            platformId: { type: "string", example: "abc123def456" },
            platformName: {
              type: "string",
              example: "Mi Plataforma de Prueba",
            },
          },
        },
        timestamp: { type: "string", example: "2025-07-12T23:30:00.000Z" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Platform not found",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid contact email",
  })
  async getApiKey(
    @Body() getApiKeyDto: GetApiKeyDto
  ): Promise<ApiResponseDto<ApiKeyResponseDto>> {
    const apiKeyData = await this.platformService.getApiKey(
      getApiKeyDto.platformId,
      getApiKeyDto.contactEmail
    );

    return new ApiResponseDto(
      true,
      "API key retrieved successfully",
      apiKeyData
    );
  }

  @Get("api-key/:platformId")
  @ApiOperation({
    summary: "Get existing API key for a platform",
    description:
      "Retrieves the existing API key for a platform using only the platform ID. Returns error if no API key exists.",
  })
  @ApiParam({
    name: "platformId",
    description: "Platform ID to get API key for",
    example: "abc123def456",
  })
  @ApiResponse({
    status: 200,
    description: "API key retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "API key retrieved successfully" },
        data: {
          type: "object",
          properties: {
            apiKey: { type: "string", example: "pk_abc123def456" },
            platformId: { type: "string", example: "abc123def456" },
            platformName: {
              type: "string",
              example: "Mi Plataforma de Prueba",
            },
          },
        },
        timestamp: { type: "string", example: "2025-07-12T23:30:00.000Z" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Platform not found or API key not found",
  })
  async getApiKeyById(
    @Param("platformId") platformId: string
  ): Promise<ApiResponseDto<ApiKeyResponseDto>> {
    const apiKeyData = await this.platformService.getApiKeyById(platformId);

    return new ApiResponseDto(
      true,
      "API key retrieved successfully",
      apiKeyData
    );
  }
}
