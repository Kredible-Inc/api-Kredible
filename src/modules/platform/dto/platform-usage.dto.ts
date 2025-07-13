import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PlatformUsageDto {
  @ApiProperty({
    description: "Platform ID",
    example: "abc123def456",
  })
  @IsString()
  platformId: string;
}

export class PlatformUsageResponseDto {
  @ApiProperty({
    description: "Type of plan",
    example: "premium",
  })
  planType: string;

  @ApiProperty({
    description: "Maximum queries allowed per month",
    example: 1000,
  })
  maxQueries: number;

  @ApiProperty({
    description: "Remaining queries for the current month",
    example: 750,
  })
  remainingQueries: number;

  @ApiProperty({
    description: "Total queries used",
    example: 250,
  })
  usedQueries: number;

  @ApiProperty({
    description: "Usage percentage",
    example: 25,
  })
  usagePercentage: number;
}
