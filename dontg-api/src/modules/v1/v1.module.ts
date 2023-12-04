import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { FoodItemModule } from "./food-item/food-item.module";
import { ChartModule } from "./chart/chart.module";
import { MealListModule } from "./meal-list/meal-list.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    FoodItemModule,
    ChartModule,
    MealListModule,
  ],
})
export class V1Module {}
