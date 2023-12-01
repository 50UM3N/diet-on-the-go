import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MealFoodService } from "./meal-food.service";
import { CreateMealFoodDTO, UpdateMealFoodDTO } from "./meal-food.dto";

@ApiTags("meal-list/meal-food")
@ApiBearerAuth("JWT-token")
@Controller("meal-list/meal-food")
export class MealFoodController {
  constructor(private mealFoodService: MealFoodService) {}

  @Get()
  async get() {
    return await this.mealFoodService.get();
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return await this.mealFoodService.getById(id);
  }

  @Get("by-meal-id/:id")
  async getByMealId(@Param("id") id: string) {
    return await this.mealFoodService.getByMealId(id);
  }

  @Post()
  async create(@Body() body: CreateMealFoodDTO) {
    return await this.mealFoodService.create(body);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateMealFoodDTO) {
    return await this.mealFoodService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.mealFoodService.delete(id);
  }
}
