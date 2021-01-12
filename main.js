const express = require("express");
const app = express();
const hbs=require('express-handlebars'); 
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const userModel = require("./models/userModel");
const bcrypt = require('bcryptjs');
const clientSessions = require("client-sessions");
const HTTP_PORT = process.env.PORT || 8080;
const multer = require("multer");
const _ = require("underscore");
const fs = require("fs");
const roomModel = require("./models/roomModel");
const PHOTODIRECTORY = "./public/photos/";
const path = require("path");

//#region fs and multer config
if (!fs.existsSync(PHOTODIRECTORY)) {
    fs.mkdirSync(PHOTODIRECTORY);
}
const storage = multer.diskStorage({
    destination: PHOTODIRECTORY,
    filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
//#endregion


/* #region CONFIGURATIONS */
function onListen(){
    console.log("I am here "+HTTP_PORT);
}
dotenv.config();
const connectionstring=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@senecaweb.m2xcu.mongodb.net/WEB_ASSIGNMENT?retryWrites=true&w=majority`;
console.log(connectionstring);
mongoose.connect(connectionstring,{ useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.static("views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(clientSessions({
    cookieName: "session",
    secret: "web322_assignment345_Session",
    duration: 30*60*1000,
    activeDuration: 1000*60
}));
app.set('views',"./views");
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

/* #endregion */


mongoose.connection.on("open", () => {
    console.log("Database connection open.");
  });

/* #region SECURITY */
function checkLogin(req, res, next) {
    if(!req.session.user) {
        res.render("login", {errorMsg: "Unauthorized access, please login", user: req.session.user, layout: false});
    } else {
        next();
    }
};
/* #endregion */

//#region app.get

app.get("/", function(req, res){
    res.render('home',{user: req.session.user, layout: false});
});
app.get("/registration", function(req, res){
    res.render('registration',{user: req.session.user, layout: false});
});
app.get("/login", function(req, res){
    res.render('login',{user: req.session.user, layout: false});
});
app.get("/dashboard", checkLogin, function(req, res){
    if(req.session.user.reservedRooms!==""){
        roomModel.findOne({filename: req.session.user.reservedRooms})
        .lean()
        .exec()
        .then((result)=>{
            res.render('dashboard', {room: result, user: req.session.user, layout: false});
        })
        .catch((err)=>{
            if(err){
                console.log(`There was an error finding ${filename}: ${err}` );
            }else{
                console.log('Successfully found');
            }
        });
    }else{
        res.render('dashboard', {user: req.session.user, layout: false});
    }

});
app.get("/add-room", checkLogin, function(req, res){
    res.render('add-room', {user: req.session.user, layout: false});
});
app.get("/logout", (req,res) => {
    req.session.reset();  
    res.redirect("/");
});
app.get("/listing", (req, res)=>{
    roomModel.find().lean()
    .exec()
    .then((photos)=>{
        _.each(photos,(photo)=>{
            photo.uploadDate = new Date(photo.createdOn).toDateString();
        });
        res.render('listing',{photos: photos, hasPhotos: !!photos.length, user: req.session.user, layout: false});
    });
});

app.get("/remove-photo/:filename",(req,res)=>{
    const filename = req.params.filename;

    roomModel.remove({filename: filename})
    .then(()=>{
        fs.unlink(PHOTODIRECTORY+filename,(err)=>{
            if(err){
                return console.log(err);
            }
            console.log("Removed file : " + filename);  
        });
        return res.redirect("/listing");
    }).catch((err)=>{
        console.log(`error ocurred while removing the photo: ${err}`);
        return res.redirect("/listing");
    });
});

app.get("/edit-room/:filename", (req,res)=>{
  
    const filename = req.params.filename;
    roomModel.findOne({filename: filename})
                    .lean()
                    .exec()
                    .then((result)=>{
    //render rather than redirect because I need to send in the document object when rendering add-room page.
    //As a result, in the add-room page, I can access and utilize the room record the User wants to update.
    //IMPT: I do not need additional edit-room page since I can use if helper function in the add-room handlebars.
                        res.render('edit-room', {room: result, user: req.session.user, layout: false});
                    })
                    .catch((err)=>{
                        if(err){
                            console.log(`There was an error finding ${filename}: ${err}` );
                        }else{
                            console.log('Successfully found');
                        }
                    });
});

app.get("/eachRoom/:filename", (req,res)=>{
    const filename = req.params.filename;
    
    roomModel.findOne({filename: filename})
    .lean()
    .exec()
    .then((result)=>{
        console.log("-----------------------------------result--------------------------------------");
        console.log(result);
        res.render('eachRoom',{ a_room: result, user: req.session.user, layout: false});
        
    }).catch((err)=>{
        console.log(`error ocurred while finding the room: ${err}`);
    });
});

app.get("/booking", checkLogin, (req,res)=>{
    const startDate=req.body.checkIn;
    const endDate=req.body.checkOut;
    
    res.render('eachRoom',{user: req.session.user, layout: false});
});

//#endregion



//#region app.post
app.post("/confirmation/:filename", checkLogin, (req,res)=>{
    const filename = req.params.filename;

    //find and update a session variable
    //
    roomModel.findOne({filename: filename})
    .lean()
    .exec()
    .then((result)=>{
            const room_booked = {
                "CheckInDate": req.body.checkIn,    
                "CheckOutDate": req.body.checkOut,
                "GuestNum": req.body.guestNum,
                "PricePerNight": req.body.pricePerNight,
                "filename": filename,
                "title": result.title,
                "description": result.description
            };
            
            req.session.user.CheckIn=req.body.checkIn;
            req.session.user.CheckOut=req.body.checkOut;

            userModel.updateOne({username: req.session.user.username},{
                $set:{
                    reservedRooms:filename 
                }
            }).exec().then((updatedRoom)=>{
                console.log(updatedRoom);
            })
            .catch((err)=>{
                if(err){
                    console.log(`There was an error updating ${filename}: ${err}` );
                }else{
                    console.log('Successfully updated');
                }
            });

    res.render('confirmation',{reservedRoom: room_booked, user: req.session.user, layout: false});
        
    }).catch((err)=>{
        console.log(`error ocurred while finding the room: ${err}`);
    });
});

app.post("/listing", (req,res)=>{
    if(req.body.where==='All'){
        roomModel.find().lean()
        .exec()
        .then((photos)=>{
            _.each(photos,(photo)=>{
                photo.uploadDate = new Date(photo.createdOn).toDateString();
            });
            res.render('listing',{photos: photos, hasPhotos: !!photos.length, user: req.session.user, layout: false});
        });
    }
    else{
        roomModel.find({location: req.body.where}).lean()
        .exec()
        .then((photos)=>{
            _.each(photos,(photo)=>{
                photo.uploadDate = new Date(photo.createdOn).toDateString();
            });
            res.render('listing',{photos: photos, hasPhotos: !!photos.length, user: req.session.user, layout: false});
        });
    }
});



app.post("/edit-room/:filename", (req,res)=>{
    const filename = req.params.filename;
    console.log("Was the Routing successful?");
    roomModel.updateOne({filename: filename},{
        $set:{
            description:req.body.description
        }
    }).exec().then(()=>{
        res.redirect("/listing");
    })
    .catch((err)=>{
        if(err){
            console.log(`There was an error updating ${filename}: ${err}` );
        }else{
            console.log('Successfully updated');
        }
    });
});

app.post("/add-room", upload.single("photo"), (req, res)=>{
    const locals = { 
        message: "Your photo was uploaded successfully",
        layout: false 
        };

    const roomMetadata = new roomModel({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
        filename: req.file.filename
    });  
    roomMetadata.save();
    res.render("add-room",{message: "Your photo was uploaded successfully", layout: false});
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        return res.render("login", {errorMsg: "Missing Credentials.", layout: false});
    }
    
    userModel.findOne({username: req.body.username})
                .exec()
                .then((a_user)=>{
                    if(!a_user){// !null=>true  !!null=>false
                        res.render("login", {errorMsg: "login does not exist!", layout: false});
                    }else{
                        
                        bcrypt.compare(req.body.password, a_user.password, (err,result)=>{
                            if(result===true){
                                console.log(a_user);
                                //create session variable
                                req.session.user={
                                    username: a_user.username,
                                    firstName: a_user.firstName,
                                    lastName: a_user.lastName,
                                    email: a_user.email,
                                    isAdmin: a_user.isAdmin,
                                    reservedRooms: a_user.reservedRooms,
                                    //temp.
                                    CheckIn:"",
                                    CheckOut:""
                                };
                                //res.redirect("/dashboard"); 
                                res.render("dashboard", {user: req.session.user, layout: false});
                            }else{
                                res.render("login", {user: req.session.user, errorMsg: "login and password does not match!", layout: false});
                            }
                        })
                    }
                });
});

app.post("/registration", (req,res)=>{
        var isEmailDuplicate;
        var isUsernameDuplicate;
        async function f(){
            var result= await userModel.findOne({email: req.body.email}).exec();
            if(result!==null){
                console.log("dup email");
                isEmailDuplicate=0;//false means duplication... might be a little confusing
                console.log(result.email);
            }else{
                isEmailDuplicate=1;
            }
        }
        
        f();

        userModel.findOne({username: req.body.username}).exec()
        .then(result=>{
            if(result!==null){
                console.log("dup username");
                isUsernameDuplicate=0;
                console.log(isUsernameDuplicate);
                console.log(result.username);
            }else{
                isUsernameDuplicate=1;
            }
         //instead of including the code block below, can I use await or resolve something?....
        if(isEmailDuplicate===1&&isUsernameDuplicate===1){
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(req.body.password,salt)
                .then(result=>{
                    const _User={
                        "username": req.body.username,
                        "email": req.body.email,
                        "password": result,
                        "firstName": req.body.firstname,
                        "lastName": req.body.lastname,
                        "isAdmin": false,
                        "reservedRooms": ""
                    };
                    var _newUser= new userModel(_User);
                    _newUser.save((err)=>{
                        if(err) { 
                            console.log("There was an error saving a new user!");
                            console.log(err);
                        } else {
                            console.log("The user was saved successfully!");
                        }
                    });
                    res.render('login',{layout: false, EmailDuplication: false, UsernameDuplication: false});
                })
            })
        }else if(isEmailDuplicate===0&&isUsernameDuplicate===1){
            console.log("email is dup");
            res.render('registration',{layout: false, EmailDuplication: true, UsernameDuplication: false});

        }else if(isEmailDuplicate===1&&isUsernameDuplicate===0){
            console.log("username is dup");
            res.render('registration',{layout: false, EmailDuplication: false, UsernameDuplication: true});
        }else{
            console.log("both are dup");
            res.render('registration',{layout: false, EmailDuplication: true, UsernameDuplication: true});
        }
        });
});

//#endregion


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT,onListen);