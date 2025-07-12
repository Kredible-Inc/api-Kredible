import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { PlanService } from "./plan.service";
import { AdminKeyGuard } from "../../auth/admin-key.guard";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

class UpdatePlanDto {
  planType: "basic" | "premium" | "enterprise";
}

@ApiTags("plans")
@Controller("plans")
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get(":platformId")
  @ApiOperation({ summary: "Get platform plan" })
  @ApiResponse({ status: 200, description: "Plan retrieved successfully" })
  async getPlan(
    @Param("platformId") platformId: string
  ): Promise<ApiResponseDto<any>> {
    const plan = await this.planService.getPlan(platformId);

    if (!plan) {
      return new ApiResponseDto(false, "Plan not found", null);
    }

    return new ApiResponseDto(true, "Plan retrieved successfully", plan);
  }

  @Put(":platformId")
  @UseGuards(AdminKeyGuard)
  @ApiOperation({ summary: "Update platform plan" })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({ status: 200, description: "Plan updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid admin key" })
  async updatePlan(
    @Param("platformId") platformId: string,
    @Body() updatePlanDto: UpdatePlanDto
  ): Promise<ApiResponseDto<any>> {
    const result = await this.planService.updatePlan(
      platformId,
      updatePlanDto.planType
    );

    return new ApiResponseDto(true, "Plan updated successfully", result);
  }
}
