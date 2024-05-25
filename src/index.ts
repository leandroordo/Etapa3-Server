import express, { Express, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.routes";
import httpStatus from "http-status";

var app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Montar todas las rutas en el path /api
app.use("/api", routes);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(httpStatus.NOT_FOUND));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
});

export default app;
