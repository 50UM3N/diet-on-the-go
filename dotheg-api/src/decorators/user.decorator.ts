import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { userDTO } from "src/modules/v1/user/user.dto";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as userDTO;
  },
);
