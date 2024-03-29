import { Body, Controller, Post, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, SignUpDTO } from "./auth.dto";
import { User } from "src/decorators/user.decorator";
import { AuthGuard } from "./auth.guard";
import { userDTO } from "../user/user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("auth")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth("JWT-token")
  @UseGuards(AuthGuard)
  @Get()
  async get(@User() user: userDTO) {
    return user;
  }

  @Post("/sign-up")
  signUp(@Body() body: SignUpDTO) {
    return this.authService.signUp(body);
  }

  @Post("/login")
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post("/google-login")
  async googleLogin(@Body("token") access_token): Promise<any> {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await res.json();
    const { name, email } = data;
    return await this.authService.googleLogin(name, email);
  }
}
