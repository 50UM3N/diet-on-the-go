import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class ChartDTO {
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
  maintainanceCalories: number;

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
