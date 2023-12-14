import { Controller, Get } from "@nestjs/common";

@Controller({
  version: "1",
})
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return { message: "server working" };
  }
}
