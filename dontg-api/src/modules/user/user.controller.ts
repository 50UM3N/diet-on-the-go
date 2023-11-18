import { Body, Controller, Get, UseGuards, Patch } from "@nestjs/common";
import { User } from "src/decorators/user.decorator";
import { UserService } from "./user.service";
import { ResetPasswordDTO, UpdateUserDTO, userDTO } from "./user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@ApiBearerAuth("JWT-token")
@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async get(@User() user: userDTO) {
    return this.userService.get(user.id);
  }

  @Patch()
  async update(@User() user: userDTO, @Body() body: UpdateUserDTO) {
    return this.userService.update(user.id, body);
  }

  @Patch("/reset-password")
  async updatePassword(@User() user: userDTO, @Body() body: ResetPasswordDTO) {
    return this.userService.resetPassword(user.id, body.password);
  }
}
