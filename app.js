const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require('express-session')

var authenticateMiddleware = require("./middlewares/authenticateMiddleware");

//add routes here
var indexRouter = require("./routes/indexRouter");
var authRouter = require("./routes/authRouter");

var app = express();

console.log("node env = " + process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "sdjkfn3478ysdjnfsd9JD",
    resave: false,
    saveUninitialized: false
  })
);

require("./passport/passportSetup")(app);

//assign routes to app
app.use("/auth", authRouter);
app.use("/",authenticateMiddleware, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
