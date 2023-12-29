import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import {
  CreateCopyMealChartDTO,
  CreateMealChartDTO,
  UpdateMealChartDTO,
} from "./meal-chart.dto";
import { MealListService } from "../meal-list/meal-list.service";

@Injectable()
export class MealChartService {
  constructor(
    private prismaService: PrismaService,
    private mealListService: MealListService,
  ) {}

  async get() {
    return await this.prismaService.mealChart.findMany();
  }

  async getByChartId(chartId: string) {
    return await this.prismaService.mealChart.findMany({
      where: {
        chartId,
      },
    });
  }

  async getById(id: string) {
    return await this.prismaService.mealChart.findUnique({
      where: {
        id,
      },
    });
  }

  async create(body: CreateMealChartDTO) {
    return await this.prismaService.mealChart.create({
      data: {
        name: body.name,
        chartId: body.chartId,
      },
    });
  }

  async copy(body: CreateCopyMealChartDTO) {
    const mealChart = await this.prismaService.mealChart.findUnique({
      where: {
        id: body.mealChartId,
      },
      include: {
        mealList: {
          include: {
            mealFood: {
              include: {
                foodItem: true,
              },
            },
          },
        },
      },
    });

    if (!mealChart) {
      throw new NotFoundException("Meal chart not found");
    }

    return await this.prismaService.$transaction(async (tx) => {
      const newMealChart = await tx.mealChart.create({
        data: {
          name: mealChart.name + " copy",
          chartId: body.chartId,
        },
      });

      for (let i = 0; i < mealChart.mealList.length; i++) {
        const meal = mealChart.mealList[i];
        const newMealList = await tx.mealList.create({
          data: {
            name: meal.name,
            mealChartId: newMealChart.id,
          },
        });

        for (let j = 0; j < meal.mealFood.length; j++) {
          const mealFood = meal.mealFood[j];
          await tx.mealFood.create({
            data: {
              qty: mealFood.qty,
              foodItemId: mealFood.foodItemId,
              mealListId: newMealList.id,
            },
          });
        }
      }

      return newMealChart;
    });
  }

  async update(id: string, body: UpdateMealChartDTO) {
    return await this.prismaService.mealChart.update({
      where: {
        id,
      },
      data: {
        name: body.name,
      },
    });
  }

  async delete(id: string) {
    return await this.prismaService.mealChart.delete({
      where: {
        id,
      },
    });
  }
}
