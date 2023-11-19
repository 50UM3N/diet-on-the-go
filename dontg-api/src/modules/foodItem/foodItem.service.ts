import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";

@Injectable()
export class FoodItemService {
  constructor(private prismaService: PrismaService) {}
  async get(id: string) {
    return await this.prismaService.foodItem.findUnique({
      where: { id },
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
}
