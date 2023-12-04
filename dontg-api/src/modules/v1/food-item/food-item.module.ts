import { Module } from "@nestjs/common";
import { FoodItemService } from "./food-item.service";
import { FoodItemController } from "./food-item.controller";

@Module({
  imports: [],
  providers: [FoodItemService],
  controllers: [FoodItemController],
})
export class FoodItemModule {}
