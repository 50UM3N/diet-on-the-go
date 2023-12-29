import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { UpdateUserDTO } from "./user.dto";
import { PasswordUtils } from "src/utils/passwordUtils";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private passwordUtils: PasswordUtils,
  ) {}
  async get(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        mobile: true,
        id: true,
        dob: true,
        height: true,
        weight: true,
        age: true,
        loginType: true,
      },
    });
  }

  async update(id: string, userDto: UpdateUserDTO) {
    if (userDto.dob) {
      const birthDate = new Date(userDto.dob);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      userDto.age = age;
    }
    return await this.prismaService.user.update({
      where: { id },
      data: {
        name: userDto.name,
        email: userDto.email,
        mobile: userDto.mobile,
        dob: userDto.dob,
        height: userDto.height,
        weight: userDto.weight,
        age: userDto.age,
      },
    });
  }

  async resetPassword(id: string, oldPassword: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    const isMatch: boolean = await this.passwordUtils.comparePasswords(
      oldPassword,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException("Old Password is incorrect");
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: await this.passwordUtils.hashPassword(password),
      },
    });
  }
}
