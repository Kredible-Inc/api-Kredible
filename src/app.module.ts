import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PlatformModule } from "./modules/platform/platform.module";
import { UserModule } from "./modules/user/user.module";
import { ScoreModule } from "./modules/score/score.module";
import { StatsModule } from "./modules/stats/stats.module";
import { PlanModule } from "./modules/plan/plan.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { LoggingMiddleware } from "./core/middleware/logging.middleware";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [configuration],
    }),
    FirebaseModule,
    PlatformModule,
    UserModule,
    ScoreModule,
    StatsModule,
    PlanModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
