import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { FoodItemDTO } from "./food-item.dto";

@Injectable()
export class FoodItemService {
  constructor(private prismaService: PrismaService) {}
  async get() {
    return await this.prismaService.foodItem.findMany({
      select: {
        name: true,
        metric: true,
        id: true,
        protein: true,
        fat: true,
        carb: true,
      },
    });
  }
  async getById(id: string) {
    return await this.prismaService.foodItem.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        metric: true,
        id: true,
        protein: true,
        fat: true,
        carb: true,
      },
    });
  }

  async create(body: FoodItemDTO) {
    return await this.prismaService.foodItem.create({
      data: {
        name: body.name,
        metric: body.metric,
        protein: body.protein,
        fat: body.fat,
        carb: body.carb,
      },
    });
  }

  async update(id: string, body: FoodItemDTO) {
    return await this.prismaService.foodItem.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        metric: body.metric,
        protein: body.protein,
        fat: body.fat,
        carb: body.carb,
      },
    });
  }

  async delete(id: string) {
    return await this.prismaService.foodItem.delete({
      where: {
        id,
      },
    });
  }
}
