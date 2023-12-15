import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class CreateMealFoodDTO {
  @IsNumber()
  @ApiProperty()
  qty: number;

  @IsString()
  @ApiProperty()
  mealListId: string;

  @IsString()
  @ApiProperty()
  foodItemId: string;
}

export class UpdateMealFoodDTO {
  @IsNumber()
  @ApiProperty()
  qty: number;

  @IsString()
  @ApiProperty()
  foodItemId: string;
}
