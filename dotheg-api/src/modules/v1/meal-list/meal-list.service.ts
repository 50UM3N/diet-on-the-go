import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateMealListDTO, UpdateMealListDTO } from "./meal-list.dto";

@Injectable()
export class MealListService {
  constructor(private prismaService: PrismaService) {}

  async get() {
    return await this.prismaService.mealList.findMany();
  }

  async getByChartId(chartId: string) {
    const data = await this.prismaService.mealList.findMany({
      where: {
        chartId,
      },
      include: {
        mealFood: {
          include: {
            foodItem: true,
          },
        },
      },
    });
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;
    const newMealList = [];
    for (let i = 0; i < data.length; i++) {
      const mealList = data[i];
      let totalMealFoodProtein = 0;
      let totalMealFoodCarb = 0;
      let totalMealFoodFat = 0;
      for (let i = 0; i < mealList.mealFood.length; i++) {
        const mealFood = mealList.mealFood[i];
        totalMealFoodProtein += Number(
          (mealFood.foodItem.protein * mealFood.qty).toFixed(2),
        );
        totalMealFoodCarb += Number(
          (mealFood.foodItem.carb * mealFood.qty).toFixed(2),
        );
        totalMealFoodFat += Number(
          (mealFood.foodItem.fat * mealFood.qty).toFixed(2),
        );
      }
      newMealList.push({
        ...mealList,
        protein: totalMealFoodProtein,
        carb: totalMealFoodCarb,
        fat: totalMealFoodFat,
      });

      totalProtein += totalMealFoodProtein;
      totalCarb += totalMealFoodCarb;
      totalFat += totalMealFoodFat;
    }

    return {
      protein: totalProtein,
      carb: totalCarb,
      fat: totalFat,
      mealList: newMealList,
    };
  }

  async getById(id: string) {
    return await this.prismaService.mealList.findUnique({
      where: {
        id,
      },
      include: {
        mealFood: {
          include: {
            foodItem: true,
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
