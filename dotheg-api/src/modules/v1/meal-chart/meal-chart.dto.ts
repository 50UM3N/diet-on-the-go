import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMealChartDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  chartId: string;
}

export class UpdateMealChartDTO {
  @IsString()
  @ApiProperty()
  name: string;
}

export class CreateCopyMealChartDTO {
  @IsString()
  @ApiProperty()
  mealChartId: string;

  @IsString()
  @ApiProperty()
  chartId: string;
}
