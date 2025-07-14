import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetApiKeyByIdDto {
  @ApiProperty({
    description: "Platform ID to get API key for",
    example: "abc123def456",
  })
  @IsString()
  platformId: string;
}
