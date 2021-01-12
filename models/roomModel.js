const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// // use bluebird promise library with mongoose
 mongoose.Promise = require("bluebird");

//user model
const roomSchema = new Schema({
    "filename":{
        type: String,
        unique: true
    },
    "title": String,
    "price": Number,
    "description": String,
    "location": String,
    "createdOn": {
        type: Date,
        default: Date.now
      }
});

module.exports = mongoose.model("rooms", roomSchema);