import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMealListDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  mealChartId: string;
}

export class UpdateMealListDTO {
  @IsString()
  @ApiProperty()
  name: string;
}
