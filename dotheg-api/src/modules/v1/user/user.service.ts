import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { UpdateUserDTO } from "./user.dto";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
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

  async resetPassword(id: string, bodyPassword: string) {
    const hashedPassword = await this.authService.hashPassword(bodyPassword);
    console.log(hashedPassword);
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
