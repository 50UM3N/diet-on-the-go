import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ChartService } from "./chart.service";
import { CreateChartDTO, UpdateChartDTO } from "./chart.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "src/decorators/user.decorator";
import { userDTO } from "../user/user.dto";

@ApiTags("chart")
@Controller({
  path: "chart",
  version: "1",
})
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async get(@User() user: userDTO) {
    return await this.chartService.get(user.id);
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return await this.chartService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async create(@Body() body: CreateChartDTO, @User() user: userDTO) {
    return await this.chartService.create(body, user.id);
  }
  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async update(@Param("id") id: string, @Body() body: UpdateChartDTO) {
    return await this.chartService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async delete(@Param("id") id: string) {
    return await this.chartService.delete(id);
  }
}
