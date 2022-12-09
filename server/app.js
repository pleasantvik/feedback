const express = require("express");

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const httpStatus = require("http-status");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRoutes");
// const tourRouter = require("./routes/tourRoutes");

const app = express();

//BODY PARSER

app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

// app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
// app.use("/api/tours", tourRouter);

// Unhandled Route
app.all("*", (req, res, next) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  next(
    new AppError(
      `Cant find ${req.originalUrl} on this server`,
      httpStatus.NOT_FOUND
    )
  );
});

//ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
