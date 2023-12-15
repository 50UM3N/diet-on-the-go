import { Module } from "@nestjs/common";
import { BackupRestoreController } from "./backup-restore.controller";
import { BackupRestoreService } from "./backup-restore.service";
import { ChartModule } from "../chart/chart.module";
import { FoodItemModule } from "../food-item/food-item.module";
import { MealListModule } from "../meal-list/meal-list.module";
import { MealFoodModule } from "../meal-list/meal-food/meal-food.module";

@Module({
  imports: [ChartModule, FoodItemModule, MealListModule, MealFoodModule],
  controllers: [BackupRestoreController],
  providers: [BackupRestoreService],
  exports: [BackupRestoreService],
})
export class BackupRestoreModule {}
