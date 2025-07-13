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
    description: "Type of plan for the platform",
    enum: ["basic", "premium", "enterprise"],
    example: "basic",
  })
  @IsEnum(["basic", "premium", "enterprise"])
  planType: "basic" | "premium" | "enterprise";
}
