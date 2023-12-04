import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "./interceptors/logger.interceptor";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "./constants";
import { PrismaModule } from "./db/prisma.module";
import { V1Module } from "./modules/v1/v1.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: "365d" },
    }),
    PrismaModule,
    V1Module,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor }],
})
export class AppModule {}
