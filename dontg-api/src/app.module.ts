import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "./interceptors/logger.interceptor";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "./constants";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { FoodItemModule } from "./modules/foodItem/foodItem.module";
import { PrismaModule } from "./db/prisma.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: "365d" },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    FoodItemModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor }],
})
export class AppModule {}
