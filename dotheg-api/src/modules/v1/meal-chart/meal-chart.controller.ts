import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { MealChartService } from "./meal-chart.service";
import {
  CreateCopyMealChartDTO,
  CreateMealChartDTO,
  UpdateMealChartDTO,
} from "./meal-chart.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("meal-chart")
@Controller({
  path: "meal-chart",
  version: "1",
})
export class MealChartController {
  constructor(private mealChartService: MealChartService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async get() {
    return await this.mealChartService.get();
  }

  @Get("by-id/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async getById(@Param("id") id: string) {
    return await this.mealChartService.getById(id);
  }

  @Get("by-chart-id/:id")
  async getByChartId(@Param("id") id: string) {
    return await this.mealChartService.getByChartId(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async create(@Body() body: CreateMealChartDTO) {
    return await this.mealChartService.create(body);
  }

  @Post("copy")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async copy(@Body() body: CreateCopyMealChartDTO) {
    return await this.mealChartService.copy(body);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async update(@Param("id") id: string, @Body() body: UpdateMealChartDTO) {
    return await this.mealChartService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async delete(@Param("id") id: string) {
    return await this.mealChartService.delete(id);
  }
}
