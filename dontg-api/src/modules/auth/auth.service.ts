import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/db/prisma.service";
import { LoginDTO, SignUpDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async signUp(body: SignUpDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (user) throw new ForbiddenException("User is already exist");

    const newUser = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
        mobile: body.mobile,
      },
    });

    const token = await this.jwtService.signAsync({
      email: newUser.email,
      id: newUser.id,
    });

    return { token, user: newUser };
  }

  async login(body: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (!user) throw new UnauthorizedException("User is not exist");
    if(user.password!==body.password) throw new UnauthorizedException("Password is incorrect")
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
    });

    return { token, user };
  }
}
