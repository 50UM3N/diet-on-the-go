import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import {
  CreateChartDTO,
  CreateCopyChartDTO,
  ImportChartDTO,
  UpdateChartDTO,
} from "./chart.dto";

@Injectable()
export class ChartService {
  constructor(private prismaService: PrismaService) {}
  async get(id: string) {
    return await this.prismaService.chart.findMany({
      where: {
        userId: id,
      },
    });
  }
  async getById(id: string) {
    return await this.prismaService.chart.findUnique({
      where: {
        id,
      },
      include: {
        mealChart: true,
      },
    });
  }

  async create(body: CreateChartDTO, userId: string) {
    return await this.prismaService.chart.create({
      data: {
        userId,
        name: body.name,
        description: body.description,
      },
    });
  }

  async copy(body: CreateCopyChartDTO, userId: string) {
    const chart = await this.prismaService.chart.findUnique({
      where: {
        id: body.chartId,
      },
      include: {
        mealChart: {
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
        },
      },
    });

    if (!chart) throw new NotFoundException("Chart not found");

    return await this.prismaService.$transaction(async (tx) => {
      const newChart = await tx.chart.create({
        data: {
          userId,
          name: chart.name + " copy",
          description: chart.description,
          weight: chart.weight,
          gender: chart.gender,
          height: chart.height,
          age: chart.age,
          activityLevel: chart.activityLevel,
          bmr: chart.bmr,
          maintenanceCalories: chart.maintenanceCalories,
          adjustAmount: chart.adjustAmount,
          adjustType: chart.adjustType,
          intakeCalories: chart.intakeCalories,
          protein: chart.protein,
          fat: chart.fat,
          carb: chart.carb,
        },
      });

      for (let i = 0; i < chart.mealChart.length; i++) {
        const mealChart = chart.mealChart[i];
        const newMealChart = await tx.mealChart.create({
          data: {
            name: mealChart.name,
            chartId: newChart.id,
          },
        });

        for (let j = 0; j < mealChart.mealList.length; j++) {
          const meal = mealChart.mealList[j];
          const newMealList = await tx.mealList.create({
            data: {
              name: meal.name,
              mealChartId: newMealChart.id,
            },
          });

          for (let k = 0; k < meal.mealFood.length; k++) {
            const mealFood = meal.mealFood[k];
            await tx.mealFood.create({
              data: {
                qty: mealFood.qty,
                foodItemId: mealFood.foodItemId,
                mealListId: newMealList.id,
              },
            });
          }
        }
      }

      return newChart;
    });
  }

  async update(id: string, body: UpdateChartDTO) {
    return await this.prismaService.chart.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        description: body.description,
        weight: body.weight,
        gender: body.gender,
        height: body.height,
        age: body.age,
        activityLevel: body.activityLevel,
        bmr: body.bmr,
        maintenanceCalories: body.maintenanceCalories,
        adjustAmount: body.adjustAmount,
        adjustType: body.adjustType,
        intakeCalories: body.intakeCalories,
        protein: body.protein,
        fat: body.fat,
        carb: body.carb,
      },
    });
  }
  async export(userId: string) {
    return await this.prismaService.chart.findMany({
      where: {
        userId: userId,
      },
      include: {
        mealChart: {
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
        },
      },
    });
  }

  async import(data: ImportChartDTO, userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      for (let i = 0; i < data.length; i++) {
        const chart = data[i];
        const newChart = await tx.chart.create({
          data: {
            userId: userId,
            name: chart.name,
            description: chart.description,
            weight: chart.weight,
            gender: chart.gender,
            height: chart.height,
            age: chart.age,
            activityLevel: chart.activityLevel,
            bmr: chart.bmr,
            maintenanceCalories: chart.maintenanceCalories,
            adjustAmount: chart.adjustAmount,
            adjustType: chart.adjustType,
            intakeCalories: chart.intakeCalories,
            protein: chart.protein,
            fat: chart.fat,
            carb: chart.carb,
          },
        });

        for (let i = 0; i < chart.mealChart.length; i++) {
          const mealChart = chart.mealChart[i];
          const newMealChart = await tx.mealChart.create({
            data: {
              name: mealChart.name,
              chartId: newChart.id,
            },
          });

          for (let j = 0; j < mealChart.mealList.length; j++) {
            const meal = mealChart.mealList[j];
            const newMealList = await tx.mealList.create({
              data: {
                name: meal.name,
                mealChartId: newMealChart.id,
              },
            });

            for (let k = 0; k < meal.mealFood.length; k++) {
              const mealFood = meal.mealFood[k];
              await tx.mealFood.create({
                data: {
                  qty: mealFood.qty,
                  foodItemId: mealFood.foodItemId,
                  mealListId: newMealList.id,
                },
              });
            }
          }
        }
        return newChart;
      }
    });
  }
  async delete(id: string) {
    return await this.prismaService.chart.delete({
      where: {
        id,
      },
    });
  }
}
