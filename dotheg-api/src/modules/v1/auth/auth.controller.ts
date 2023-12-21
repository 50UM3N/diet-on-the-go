import { Body, Controller, Post, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, SignUpDTO } from "./auth.dto";
import { User } from "src/decorators/user.decorator";
import { AuthGuard } from "./auth.guard";
import { userDTO } from "../user/user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.APP_GOOGLE_CLIENT_ID,
  process.env.APP_GOOGLE_CLIENT_SECRET,
);

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

  @Post("/googleLogin")
  async googleLogin(@Body("token") token): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();
    const data = await this.authService.googleLogin(name, email);
    console.log(data);
    return data;
  }
}
