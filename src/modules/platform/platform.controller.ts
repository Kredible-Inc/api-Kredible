import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { PlatformService } from "./platform.service";
import { AdminKeyGuard } from "../../auth/admin-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";
import { CreatePlatformDto } from "./dto/create-platform.dto";
import { GetApiKeyDto } from "./dto/get-api-key.dto";
import {
  PlatformResponseDto,
  ApiKeyResponseDto,
} from "./dto/platform-response.dto";
import { PlatformByOwnerDto } from "./dto/platforms-by-owner.dto";

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
            planType: { type: "string", example: "basic" },
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
              planType: { type: "string", example: "basic" },
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
}
