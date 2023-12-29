import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { RestoreDTO } from "./backup-restore.dto";
import { FoodItemService } from "../food-item/food-item.service";
import { ChartService } from "../chart/chart.service";
import { MealListService } from "../meal-list/meal-list.service";
import { MealFoodService } from "../meal-list/meal-food/meal-food.service";

@Injectable()
export class BackupRestoreService {
  constructor(
    private prismaService: PrismaService,
    private foodItemService: FoodItemService,
    private chartService: ChartService,
    private mealListService: MealListService,
    private mealFoodService: MealFoodService,
  ) {}

  async createBackup(userId: string): Promise<RestoreDTO> {
    const charts: any = await this.prismaService.chart.findMany({
      where: { userId },
      include: {
        // mealList: {
        //   include: {
        //     mealFood: {
        //       include: {
        //         foodItem: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    const foodItems = await this.prismaService.foodItem.findMany();
    return {
      charts,
      foodItems,
    };
  }

  async restoreBackup(userId: string, data: RestoreDTO) {
    const foodItemMap: any = {};

    for (let i = 0; i < data.foodItems.length; i++) {
      const foodItem = data.foodItems[i];
      const newFoodItem = await this.foodItemService.create({
        name: foodItem.name,
        carb: foodItem.carb,
        protein: foodItem.protein,
        fat: foodItem.fat,
        metric: foodItem.metric as any,
      });
      foodItemMap[foodItem.id] = newFoodItem.id;
    }

    for (let i = 0; i < data.charts.length; i++) {
      const chartItem = data.charts[i];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newChartItem = await this.prismaService.chart.create({
        data: {
          userId,
          name: chartItem.name,
          description: chartItem.description,
          weight: chartItem.weight,
          gender: chartItem.gender,
          height: chartItem.height,
          age: chartItem.age,
          activityLevel: chartItem.activityLevel,
          bmr: chartItem.bmr,
          maintenanceCalories: chartItem.maintenanceCalories,
          adjustAmount: chartItem.adjustAmount,
          intakeCalories: chartItem.intakeCalories,
          adjustType: chartItem.adjustType,
          protein: chartItem.protein,
          fat: chartItem.fat,
          carb: chartItem.carb,
        },
      });

      // for (let i = 0; i < chartItem.mealList.length; i++) {
      //   const mealListItem = chartItem.mealList[i];
      //   const newMealListItem = await this.mealListService.create({
      //     name: mealListItem.name,
      //     chartId: newChartItem.id,
      //   });

      //   for (let i = 0; i < mealListItem.mealFood.length; i++) {
      //     const mealFoodItem = mealListItem.mealFood[i];
      //     await this.mealFoodService.create({
      //       foodItemId: foodItemMap[mealFoodItem.foodItem.id],
      //       qty: mealFoodItem.qty,
      //       mealListId: newMealListItem.id,
      //     });
      //   }
      // }
    }
  }

  async deleteAll(userId: string) {
    await this.prismaService.foodItem.deleteMany();

    await this.prismaService.chart.deleteMany({
      where: { userId },
    });

    return { message: "All Data Deleted Successfully." };
  }
}
