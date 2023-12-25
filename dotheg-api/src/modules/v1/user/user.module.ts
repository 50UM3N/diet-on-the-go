import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [],
  providers: [UserService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
