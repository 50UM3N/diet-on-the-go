import {
  Controller,
  UseGuards,
  Get,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  ForbiddenException,
  Delete,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { BackupRestoreService } from "./backup-restore.service";
import { User } from "src/decorators/user.decorator";
import { userDTO } from "../user/user.dto";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { RestoreDTO } from "./backup-restore.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

@ApiTags("backup-restore")
@ApiBearerAuth("JWT-token")
@Controller({ path: "backup-restore", version: "1" })
@UseGuards(AuthGuard)
export class BackupRestoreController {
  constructor(private readonly backupRestoreService: BackupRestoreService) {}

  @Get("backup")
  async get(@Res() res: Response, @User() user: userDTO) {
    const data = await this.backupRestoreService.createBackup(user.id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.id}.json`,
    );
    res.send(JSON.stringify(data));
  }

  @Post("restore")
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
      const data: RestoreDTO = JSON.parse(file.buffer.toString());
      return await this.backupRestoreService.restoreBackup(user.id, data);
    } catch (error) {
      throw new ForbiddenException("Error reading JSON file.");
    }
  }

  @Delete("delete-all")
  async deleteAll(@User() user: userDTO) {
    return await this.backupRestoreService.deleteAll(user.id);
  }
}
