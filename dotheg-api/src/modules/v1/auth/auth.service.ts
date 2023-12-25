import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/db/prisma.service";
import { LoginDTO, SignUpDTO } from "./auth.dto";
import { LoginType } from "src/constants";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (user) throw new ForbiddenException("User is already exist");

    const newUser = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: await this.hashPassword(body.password),
        name: body.name,
        mobile: body.mobile,
        loginType: LoginType.DEFAULT,
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

    if (!user) throw new UnauthorizedException("User doesn't exists");
    const isMatch: boolean = await this.comparePasswords(
      body.password,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException("Password is incorrect");
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
    });

    return { token, user };
  }
  async googleLogin(name: string, email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          name: name,
          password: await this.hashPassword(email),
          loginType: LoginType.GOOGLE,
        },
      });
      const token = await this.jwtService.signAsync({
        email: newUser.email,
        id: newUser.id,
      });
      return { token, user: newUser };
    } else {
      if (user.loginType !== LoginType.GOOGLE) {
        throw new UnauthorizedException(
          "User already exists with different login type",
        );
      }
      const token = await this.jwtService.signAsync({
        email: user.email,
        id: user.id,
      });
      return { token, user };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  }
}
