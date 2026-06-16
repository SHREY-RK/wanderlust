const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { log } = require("node:console");

// connect with database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL)
.then(()=> {
    console.log("database connected");
});

const initDB = async ()=> {
    await Listing.deleteMany({});
    const newData = initData.data.map((obj) => {
        return { ...obj, owner: "6a309475c1d3ab8f96f1af14"};
    })
    await Listing.insertMany(newData);
    console.log("data saved successfully");
}

initDB();