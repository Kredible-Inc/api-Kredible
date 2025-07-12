import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

class CreateUserDto {
  walletAddress: string;
  email?: string;
  name?: string;
}

class AddDocumentDto {
  type: string;
  url: string;
}

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "User created successfully" })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<ApiResponseDto<any>> {
    const user = await this.userService.createUser(createUserDto);

    return new ApiResponseDto(true, "User created successfully", user);
  }

  @Get(":walletAddress")
  @ApiOperation({ summary: "Get user by wallet address" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  async getUser(
    @Param("walletAddress") walletAddress: string
  ): Promise<ApiResponseDto<any>> {
    const user = await this.userService.getUserByWalletAddress(walletAddress);

    if (!user) {
      return new ApiResponseDto(false, "User not found", null);
    }

    return new ApiResponseDto(true, "User retrieved successfully", user);
  }

  @Post(":walletAddress/documents")
  @ApiOperation({ summary: "Add document to user" })
  @ApiBody({ type: AddDocumentDto })
  @ApiResponse({ status: 201, description: "Document added successfully" })
  async addDocument(
    @Param("walletAddress") walletAddress: string,
    @Body() addDocumentDto: AddDocumentDto
  ): Promise<ApiResponseDto<any>> {
    const result = await this.userService.addDocument(walletAddress, {
      ...addDocumentDto,
      uploadedAt: new Date(),
    });

    return new ApiResponseDto(true, "Document added successfully", result);
  }

  @Get(":walletAddress/activity")
  @ApiOperation({ summary: "Get user activity" })
  @ApiResponse({ status: 200, description: "Activity retrieved successfully" })
  async getUserActivity(
    @Param("walletAddress") walletAddress: string
  ): Promise<ApiResponseDto<any>> {
    const activity = await this.userService.getUserActivity(walletAddress);

    return new ApiResponseDto(
      true,
      "Activity retrieved successfully",
      activity
    );
  }
}
