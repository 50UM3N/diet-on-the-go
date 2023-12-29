import { Module } from "@nestjs/common";
import { MealChartService } from "./meal-chart.service";
import { MealChartController } from "./meal-chart.controller";
import { MealListModule } from "../meal-list/meal-list.module";

@Module({
  imports: [MealListModule],
  providers: [MealChartService],
  controllers: [MealChartController],
  exports: [MealChartService],
})
export class MealChartModule {}
