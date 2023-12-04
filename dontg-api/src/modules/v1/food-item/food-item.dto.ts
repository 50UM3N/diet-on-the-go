import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, Matches } from "class-validator";
import { FoodItemMetric } from "src/constants";

export class FoodItemDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @Matches(
    `^${Object.values(FoodItemMetric)
      .filter((v) => typeof v !== "number")
      .join("|")}$`,
    "i",
  )
  metric: FoodItemMetric;

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
