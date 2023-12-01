import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateMealFoodDTO, UpdateMealFoodDTO } from "./meal-food.dto";

@Injectable()
export class MealFoodService {
  constructor(private prismaService: PrismaService) {}

  async get() {
    return await this.prismaService.mealFood.findMany();
  }

  async getById(id: string) {
    return await this.prismaService.mealFood.findUnique({
      where: {
        id,
      },
    });
  }
  async getByMealId(id: string) {
    return await this.prismaService.mealFood.findMany({
      where: {
        mealListId: id,
      },
      include: {
        foodItem: true,
      },
    });
  }

  async create(body: CreateMealFoodDTO) {
    return await this.prismaService.mealFood.create({
      data: body,
    });
  }

  async update(id: string, body: UpdateMealFoodDTO) {
    return await this.prismaService.mealFood.update({
      where: {
        id,
      },
      data: body,
    });
  }

  async delete(id: string) {
    return await this.prismaService.mealFood.delete({
      where: {
        id,
      },
    });
  }
}
