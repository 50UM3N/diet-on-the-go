import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";
import { Chart, FoodItem, MealChart, MealFood, MealList } from "@prisma/client";

export class CreateChartDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;
}

export class CreateCopyChartDTO {
  @IsString()
  @ApiProperty()
  chartId: string;
}
export class UpdateChartDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber()
  @ApiProperty()
  weight: number;

  @IsString()
  @ApiProperty()
  gender: string;

  @IsNumber()
  @ApiProperty()
  height: number;

  @IsNumber()
  @ApiProperty()
  age: number;

  @IsNumber()
  @ApiProperty()
  activityLevel: number;

  @IsNumber()
  @ApiProperty()
  bmr: number;

  @IsNumber()
  @ApiProperty()
  maintenanceCalories: number;

  @IsNumber()
  @ApiProperty()
  adjustAmount: number;

  @IsString()
  @ApiProperty()
  adjustType: string;

  @IsNumber()
  @ApiProperty()
  intakeCalories: number;

  @IsNumber()
  @ApiProperty()
  protein: number;

  @IsNumber()
  @ApiProperty()
  fat: number;

  @IsNumber()
  @ApiProperty()
  carb: number;
}

export type ImportChartDTO = (Chart & {
  mealChart: (MealChart & {
    mealList: (MealList & {
      mealFood: (MealFood & {
        foodItem: FoodItem;
      })[];
    })[];
  })[];
})[];
