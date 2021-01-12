// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// // use bluebird promise library with mongoose
 mongoose.Promise = require("bluebird");

//user model
const userSchema = new Schema({
    "username": {
        type: String,
        unique: true },
    "password": String,
    "firstName": String,
    "lastName": String,
    "email": {
        type: String,
        unique: true },
    "isAdmin": Boolean,
    "reservedRooms":String
});
//new Schema({ arr: { type: Array, of: String } });

module.exports = mongoose.model("users", userSchema);



// const userSchema2 = new Schema({
//     "email": {
//         type: String,
//         unique: true },
//     "password": String,
//     "firstName": String,
//     "lastName": String,
//     "isAdmin": Boolean
// });