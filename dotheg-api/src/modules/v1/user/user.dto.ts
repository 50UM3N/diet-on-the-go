import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  mobile: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  dob: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  height: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  weight: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  age: number;
}

export class userDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  mobile: string;
}

export class ResetPasswordDTO {
  @IsString()
  @ApiProperty()
  password: string;
}
