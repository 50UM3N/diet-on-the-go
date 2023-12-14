import { Module } from "@nestjs/common";
import { MealFoodService } from "./meal-food.service";
import { MealFoodController } from "./meal-food.controller";

@Module({
  providers: [MealFoodService],
  controllers: [MealFoodController],
  exports: [MealFoodService],
})
export class MealFoodModule {}
