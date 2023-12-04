import { Module } from "@nestjs/common";
import { ChartService } from "./chart.service";
import { ChartController } from "./chart.controller";

@Module({
  imports: [],
  providers: [ChartService],
  controllers: [ChartController],
})
export class ChartModule {}
