import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PasswordUtils } from "src/utils/passwordUtils";

@Module({
  imports: [],
  providers: [AuthService, PasswordUtils],
  controllers: [AuthController],
})
export class AuthModule {}
