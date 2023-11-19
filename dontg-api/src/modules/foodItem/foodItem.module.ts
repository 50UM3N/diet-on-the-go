import { Module } from "@nestjs/common";
import { FoodItemService } from "./foodItem.service";
import { FoodItemController } from "./foodItem.controller";

@Module({
  imports: [],
  providers: [FoodItemService],
  controllers: [FoodItemController],
})
export class FoodItemModule {}
