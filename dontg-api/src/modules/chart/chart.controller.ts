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
import { ChartDTO } from "./chart.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("chart")
@ApiBearerAuth("JWT-token")
@Controller("chart")
@UseGuards(AuthGuard)
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Get("/:id")
  async getById(@Param("id") id: string) {
    return await this.chartService.getById(id);
  }

  @Post()
  async create(@Body() body: ChartDTO) {
    return await this.chartService.create(body);
  }
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: ChartDTO) {
    return await this.chartService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.chartService.delete(id);
  }
}
