import { Module } from "@nestjs/common";
import { MealListService } from "./meal-list.service";
import { MealListController } from "./meal-list.controller";

@Module({
  imports: [],
  providers: [MealListService],
  controllers: [MealListController],
})
export class MealListModule {}
