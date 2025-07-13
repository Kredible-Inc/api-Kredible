import { ApiProperty } from "@nestjs/swagger";

export class PlatformByOwnerDto {
  @ApiProperty({ example: "abc123def456" })
  id: string;

  @ApiProperty({ example: "Mi Plataforma de Prueba" })
  name: string;

  @ApiProperty({ example: "Una plataforma para probar la API de Kredible" })
  description?: string;

  @ApiProperty({ example: "admin@miplataforma.com" })
  contactEmail: string;

  @ApiProperty({
    example: "GABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG",
  })
  ownerAddress: string;

  @ApiProperty({ example: "basic" })
  planType: string;

  @ApiProperty({
    description: "Indicates if the platform has an API key",
    example: true,
  })
  hasApiKey: boolean;
}
