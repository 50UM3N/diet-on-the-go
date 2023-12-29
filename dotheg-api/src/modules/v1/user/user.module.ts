import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PasswordUtils } from "src/utils/passwordUtils";

@Module({
  imports: [],
  providers: [UserService, PasswordUtils],
  controllers: [UserController],
})
export class UserModule {}
