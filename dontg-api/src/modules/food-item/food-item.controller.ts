import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from "@nestjs/common";
import { FoodItemService } from "./food-item.service";
import { FoodItemDTO } from "./food-item.dto";

@Controller("food-item")
export class FoodItemController {
  constructor(private foodItemService: FoodItemService) {}

  @Get()
  async get() {
    return await this.foodItemService.get();
  }

  @Get("/:id")
  async getById(@Param("id") id: string) {
    return await this.foodItemService.getById(id);
  }

  @Post()
  async create(@Body() body: FoodItemDTO) {
    return await this.foodItemService.create(body);
  }
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: FoodItemDTO) {
    return await this.foodItemService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.foodItemService.delete(id);
  }
}
