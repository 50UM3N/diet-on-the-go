import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/db/prisma.service";
import { BackupRestoreService } from "src/modules/v1/backup-restore/backup-restore.service";
import { Storage } from "megajs";

@Injectable()
export class BackupCorn {
  constructor(
    private backup: BackupRestoreService,
    private prismaService: PrismaService,
  ) {}

  @Cron("0 23 * * *")
  async backupCornJob() {
    const storage = await new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    }).ready;
    const folderName = "diet_on_the_go";
    let folder = storage.root.children.find(
      (child) => child.name === folderName,
    );
    if (!folder) folder = await storage.mkdir(folderName);
    const users = await this.prismaService.user.findMany();
    for (const user of users) {
      const backup = await this.backup.createBackup(user.id);
      const currentDate = new Date();
      const formattedDate = currentDate.toJSON().slice(0, 10);
      const fileName = user.id + "_" + formattedDate + ".json";
      folder.upload(fileName, JSON.stringify(backup));
    }
  }
}
