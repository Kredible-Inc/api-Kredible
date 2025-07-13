import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class GetApiKeyDto {
  @ApiProperty({
    description: "Platform ID to get API key for",
    example: "abc123def456",
  })
  @IsString()
  platformId: string;

  @ApiProperty({
    description: "Contact email to verify platform ownership",
    example: "admin@miplataforma.com",
  })
  @IsEmail()
  contactEmail: string;
}
