import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { FoodItemService } from "./food-item.service";
import { FoodItemDTO } from "./food-item.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("food-item")
@ApiBearerAuth("JWT-token")
@Controller({
  path: "food-item",
  version: "1",
})
@UseGuards(AuthGuard)
export class FoodItemController {
  constructor(private foodItemService: FoodItemService) {}

  @Get()
  async get() {
    return await this.foodItemService.get();
  }

  @Get("by-id/:id")
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
