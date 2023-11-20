import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateMealListDTO, UpdateMealListDTO } from "./meal-list.dto";

@Injectable()
export class MealListService {
  constructor(private prismaService: PrismaService) {}

  async get() {
    return await this.prismaService.mealList.findMany({
      include: {
        foodItem: true,
      },
    });
  }

  async getById(id: string) {
    return await this.prismaService.mealList.findUnique({
      where: {
        id,
      },
      include: {
        foodItem: true,
      },
    });
  }

  async addFoodItem(id: string, foodItemId: string) {
    return await this.prismaService.mealList.update({
      where: {
        id,
      },
      data: {
        foodItem: {
          connect: {
            id: foodItemId,
          },
        },
      },
    });
  }

  async removeFoodItem(id: string, foodItemId: string) {
    return await this.prismaService.mealList.update({
      where: {
        id,
      },
      data: {
        foodItem: {
          disconnect: {
            id: foodItemId,
          },
        },
      },
    });
  }

  async create(body: CreateMealListDTO) {
    return await this.prismaService.mealList.create({
      data: {
        name: body.name,
        chartId: body.chartId,
      },
    });
  }

  async update(id: string, body: UpdateMealListDTO) {
    return await this.prismaService.mealList.update({
      where: {
        id,
      },
      data: {
        name: body.name,
      },
    });
  }

  async delete(id: string) {
    return await this.prismaService.mealList.delete({
      where: {
        id,
      },
    });
  }
}
