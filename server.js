const express = require("express");
const morgan = require("morgan"); //log view request detail to server
const config = require("config");
const mongo = require("./config/mongo");
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const app = express();
app.use(morgan("dev"));

//------------ Passport Configuration ------------//
require('./middleware/passport')(passport);

let isDev = process.env.NODE_ENV !== "production";
app.locals.env = process.env.NODE_ENV || config.get("env");

//app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(express.static("uploadsFile"));
app.use(express.static("public")); //static rsc from public folder
app.set("view engine", "ejs");
app.set("views", "./views"); // html client side from views folder

mongo.connect();
app.use(cors());
app.use(express.urlencoded({ limit: '4GB', extended: true }));

app.use(express.json());

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    }, //30 days
    secret: config.get("jwtSecret"),
    resave: true,
    saveUninitialized: true,
  })
);
//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const index = require("./routes/index");
const auth = require("./routes/auth");
const home = require("./routes/home");
const guest = require("./routes/guest");
app.use("/home", home);
app.use("/guest", guest);
app.use("/auth", auth);
app.use("/", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
  if(err.status=404) {
    res.status(err.status);
    res.render('404');
  } else {
    res.status(500);
    res.render('500');
  }
  
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
