import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { MealListService } from "./meal-list.service";
import { CreateMealListDTO } from "./meal-list.dto";

@Controller("meal-list")
export class MealListController {
  constructor(private mealListService: MealListService) {}

  @Get()
  async get() {
    return await this.mealListService.get();
  }

  @Get(":id")
  async getById(id: string) {
    return await this.mealListService.getById(id);
  }

  @Post(":id/food-item/:foodItemId")
  async addFoodItem(
    @Param("id") id: string,
    @Param("foodItemId") foodItemId: string,
  ) {
    return await this.mealListService.addFoodItem(id, foodItemId);
  }

  @Delete(":id/food-item/:foodItemId")
  async removeFoodItem(
    @Param("id") id: string,
    @Param("foodItemId") foodItemId: string,
  ) {
    return await this.mealListService.removeFoodItem(id, foodItemId);
  }

  @Post()
  async create(body: CreateMealListDTO) {
    return await this.mealListService.create(body);
  }

  @Patch(":id")
  async update(@Param("id") id: string, body: CreateMealListDTO) {
    return await this.mealListService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.mealListService.delete(id);
  }
}
