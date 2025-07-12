import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url, headers } = req;

    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    console.log(`Headers: x-api-key: ${headers["x-api-key"] ? "***" : "none"}`);

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  }
}
