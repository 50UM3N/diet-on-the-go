import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateChartDTO, UpdateChartDTO } from "./chart.dto";

@Injectable()
export class ChartService {
  constructor(private prismaService: PrismaService) {}
  async get() {
    return await this.prismaService.chart.findMany();
  }
  async getById(id: string) {
    return await this.prismaService.chart.findUnique({
      where: {
        id,
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

  async delete(id: string) {
    return await this.prismaService.chart.delete({
      where: {
        id,
      },
    });
  }
}
