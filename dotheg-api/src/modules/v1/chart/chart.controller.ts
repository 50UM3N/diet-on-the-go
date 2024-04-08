import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ChartService } from "./chart.service";
import {
  CreateChartDTO,
  CreateCopyChartDTO,
  ImportChartDTO,
  UpdateChartDTO,
} from "./chart.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { User } from "src/decorators/user.decorator";
import { userDTO } from "../user/user.dto";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

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

  @Post("copy")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async copy(@Body() body: CreateCopyChartDTO, @User() user: userDTO) {
    return await this.chartService.copy(body, user.id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async update(@Param("id") id: string, @Body() body: UpdateChartDTO) {
    return await this.chartService.update(id, body);
  }

  @Get("export")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async export(@Res() res: Response, @User() user: userDTO) {
    const data = await this.chartService.export(user.id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=meal-chart.json`,
    );
    res.send(JSON.stringify(data));
  }

  @Post("import")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async readJsonFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: userDTO,
  ) {
    if (!file) throw new NotFoundException("No File Found.");
    try {
      const data: ImportChartDTO = JSON.parse(file.buffer.toString());
      return await this.chartService.import(data, user.id);
    } catch (error) {
      throw new ForbiddenException("Error reading JSON file.");
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-token")
  async delete(@Param("id") id: string) {
    return await this.chartService.delete(id);
  }
}
