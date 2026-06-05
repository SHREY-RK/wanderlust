const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const PORT=8080;

app.set("view engine", "ejs");
app.set("viwes", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"))

const Listing = require("./models/listing.js");

// connect with database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
.then(()=> {
    console.log("database connected");
})

//API request

//home page all property
app.get("/listings", async (req, res)=> {
    let data = await Listing.find();
    res.render("listing/index.ejs", {data});
})

//for detail view of property
app.get("/listings/:id/view", async (req, res)=> {
    let {id} = req.params;
    const data = await Listing.findById(id);
    res.render("listing/view.ejs", {data, id});
})

//new property adding and collect data
app.get("/listings/new", (req, res)=> {
    res.render("listing/add.ejs");
})
app.post("/listings", (req, res)=> {
    Listing.insertOne(req.body.listing);
    res.redirect("/listings");
}) 

//edit property
app.get("/listings/:id/edit", async (req, res)=> {
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("listing/edit.ejs", {data});
})
app.put("/listings/:id", async (req, res)=> {
    let {id} = req.params;
    let {description, price, url} = req.body;
    if (price!="") {
        await Listing.findByIdAndUpdate(id, {price: price});
    }
    if (description!="") {
        await Listing.findByIdAndUpdate(id, {description: description});
    }
    if (url!="") {
        await Listing.findByIdAndUpdate(id, {"image.url": url}, {new: true}).then((data)=> {
        });
    }
    res.redirect(`/listings/${id}/view`);
})

//delete property
app.delete("/listings/:id/delete", async (req, res)=> {
    let {id} = req.params;

    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(PORT, ()=> {
    console.log(`app is listening on ${PORT}`);
})

