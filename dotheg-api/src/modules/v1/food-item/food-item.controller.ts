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
import { FoodItemService } from "./food-item.service";
import { FoodItemDTO } from "./food-item.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { FoodItem } from "@prisma/client";

@ApiTags("food-item")
@ApiBearerAuth("JWT-token")
@Controller({
  path: "food-item",
  version: "1",
})
@UseGuards(AuthGuard)
export class FoodItemController {
  constructor(private foodItemService: FoodItemService) {}

  @Get()
  async get() {
    return await this.foodItemService.get();
  }

  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return await this.foodItemService.getById(id);
  }

  @Post()
  async create(@Body() body: FoodItemDTO) {
    return await this.foodItemService.create(body);
  }
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: FoodItemDTO) {
    return await this.foodItemService.update(id, body);
  }

  @Get("export")
  async export(@Res() res: Response) {
    const data = await this.foodItemService.export();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=food-item.json`);
    res.send(JSON.stringify(data));
  }

  @Post("import")
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
  async readJsonFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new NotFoundException("No File Found.");
    console.log(file.buffer.toString());
    try {
      const data: FoodItem[] = JSON.parse(file.buffer.toString());
      return await this.foodItemService.import(data);
    } catch (error) {
      throw new ForbiddenException("Error reading JSON file.");
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.foodItemService.delete(id);
  }
}
