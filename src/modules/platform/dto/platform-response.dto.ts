import { ApiProperty } from "@nestjs/swagger";

export class PlatformResponseDto {
  @ApiProperty({ example: "abc123def456" })
  id: string;

  @ApiProperty({ example: "Mi Plataforma de Prueba" })
  name: string;

  @ApiProperty({ example: "Una plataforma para probar la API de Kredible" })
  description?: string;

  @ApiProperty({ example: "admin@miplataforma.com" })
  contactEmail: string;

  @ApiProperty({ example: "basic" })
  planType: string;
}

export class ApiKeyResponseDto {
  @ApiProperty({ example: "pk_abc123def456" })
  apiKey: string;

  @ApiProperty({ example: "abc123def456" })
  platformId: string;

  @ApiProperty({ example: "Mi Plataforma de Prueba" })
  platformName: string;
}
