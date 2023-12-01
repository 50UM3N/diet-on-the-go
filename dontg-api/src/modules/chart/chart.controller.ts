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
@ApiBearerAuth("JWT-token")
@Controller("chart")
@UseGuards(AuthGuard)
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Get()
  async get() {
    return await this.chartService.get();
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return await this.chartService.getById(id);
  }

  @Post()
  async create(@Body() body: CreateChartDTO, @User() user: userDTO) {
    return await this.chartService.create(body, user.id);
  }
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateChartDTO) {
    return await this.chartService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.chartService.delete(id);
  }
}
