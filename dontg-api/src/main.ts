import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { PrismaService } from "./db/prisma.service";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("OC API Project")
    .setDescription("The OC API description")
    .setVersion("1.0")
    .setExternalDoc("Postman Collection", "/api-json")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-token",
    )
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const message =
          validationErrors[0].constraints[
            Object.keys(validationErrors[0].constraints)[0]
          ];
        return new BadRequestException(message);
      },
    }),
  );
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.get(PrismaService);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
