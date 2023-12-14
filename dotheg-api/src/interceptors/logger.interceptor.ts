import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const resTime = endTime - startTime;
        this.logger.log(
          `${req.method} ${req.path} ${res.statusCode} ${resTime}ms`
        );
      })
    );
  }
}
