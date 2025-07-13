import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsEnum, IsOptional } from "class-validator";

export class CreatePlatformDto {
  @ApiProperty({
    description: "Name of the platform",
    example: "Mi Plataforma de Prueba",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the platform",
    example: "Una plataforma para probar la API de Kredible",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Contact email for the platform",
    example: "admin@miplataforma.com",
  })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({
    description: "Owner wallet address for the platform",
    example: "GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
  })
  @IsString()
  ownerAddress: string;

  @ApiProperty({
    description: "Type of plan for the platform",
    enum: ["free", "premium", "premium_pro"],
    example: "premium",
  })
  @IsEnum(["free", "premium", "premium_pro"])
  planType: "free" | "premium" | "premium_pro";
}
