import { Module } from "@nestjs/common";
import { MealListService } from "./meal-list.service";
import { MealListController } from "./meal-list.controller";
import { MealFoodModule } from "./meal-food/meal-food.module";

@Module({
  imports: [MealFoodModule],
  providers: [MealListService],
  controllers: [MealListController],
})
export class MealListModule {}
