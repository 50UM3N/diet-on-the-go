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
import { MealListService } from "./meal-list.service";
import { CreateMealListDTO, UpdateMealListDTO } from "./meal-list.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("meal-list")
@ApiBearerAuth("JWT-token")
@Controller("meal-list")
@UseGuards(AuthGuard)
export class MealListController {
  constructor(private mealListService: MealListService) {}

  @Get()
  async get() {
    return await this.mealListService.get();
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return await this.mealListService.getById(id);
  }

  @Get("by-chart-id/:id")
  async getByChartId(@Param("id") id: string) {
    return await this.mealListService.getByChartId(id);
  }

  @Post()
  async create(@Body() body: CreateMealListDTO) {
    return await this.mealListService.create(body);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateMealListDTO) {
    return await this.mealListService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.mealListService.delete(id);
  }
}
