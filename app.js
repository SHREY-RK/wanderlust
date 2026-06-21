if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
// const { listingSchema, reviewSchema } = require("./schema");
const ejsMate = require("ejs-mate");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const PORT = 8080;
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// models
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

// connect with database
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl).then(() => {
  console.log("database connected");
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", (error) => {
  console.log("Error in session store", error);
  
})
const sessionOption = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.deleteListing = req.flash("deleteListing");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.get("/", (req, res) => {
  res.send("home page");
});
//========================demo user=====================
// app.get("/demoUser", wrapAsync(async (req, res) => {
//     const fakeUser = new User({
//         email: "abcd@gmail.com",
//         username: "abcd2"
//     })
//     await User.register(fakeUser, "helloword");
//     res.send("ok");
// }))
//rotes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//if request not satisfy
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//error handeler middelware
app.use((err, req, res, next) => {
//   console.log(err);
  let { statusCode = 500, message = "Something went wrong." } = err;
  console.log("Error: ", message);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
