import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors"

import { router as indexRouter } from "./routes/index";
import { router as contactsRouter } from "./routes/contacts";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors())

app.use("/", indexRouter);
app.use("/contacts", contactsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

interface ErrorWithStatus extends Error {
  status: number;
}

app.use(function (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ status: "NG", message: "fatal error" });
});

export default app;
