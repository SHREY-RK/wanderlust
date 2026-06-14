const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js"); 

const session = require("express-session");
const flash = require("connect-flash");

const app = express();

const PORT=8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// models
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

const sessionOption = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};
app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash("message");
    res.locals.deleteListing = req.flash("deleteListing");
    res.locals.error = req.flash("error");
    next();
})

//rotes
app.use("/listings", listing)
app.use("/listings/:id/reviews", review);

// connect with database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
.then(()=> {
    console.log("database connected");
})


//if request not satisfy 
app.use((req, res, next)=> {
    next(new ExpressError(404, "Page Not Found!"));
}) 

//error handeler middelware
app.use((err, req, res, next)=> {
    let {statusCode=500, message="Something went wrong."} = err;
    console.log("Error: ", message);
    // res.status(statusCode).send(message);  
    res.status(statusCode).render("error.ejs", {message})
})

app.listen(PORT, ()=> {
    console.log(`app is listening on ${PORT}`);
})

