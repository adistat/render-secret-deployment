const  express = require("express");
const  bodyparser = require("body-parser");
const ejs = require("ejs");
var app = express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
// const dotenv = require("dotenv");
require("dotenv").config();

const mongoose = require('mongoose');
const dburl = process.env.atlas_url;
mongoose.connect(dburl,{
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log("Mongodb connected."))
.catch((err) => console.error("Mongodb error:",err));
mongoose.set("strictQuery",true);

const trySchema = new mongoose.Schema({
    name: String, email: String , password: String
});

const secret = "thisislittlesecret.";
const encrypt = require("mongoose-encryption");
trySchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User = mongoose.model("peoples",trySchema);

app.get("/",async function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/test",async function(req,res){
    res.render("secrets");
});
app.post("/register",async function(req,res){
    try{
        const newuser = new User({
        name:  req.body.name, email:  req.body.username, password:  req.body.password
        });
        await  newuser.save();
        res.redirect("login");
     } catch (err){res.send("register error");}
});

app.get("/login",async function(req,res){
    res.render("login");
});

app.post("/login",async function(req,res){
  const username = req.body.username;
    const password = req.body.password;
    const foundUser =await User.findOne({email:username});
    if(foundUser && foundUser.password === password){
          res.redirect("/secrets");
    }else{
        res.send("not a user..");
    }
});

app.get("/secrets",async function(req,res){
    res.render("secrets");
});
app.get("/submit",async function(req,res){
    res.render("submit");
});
// app.post("/submit",async function(req,res){
//     res.send("Thank you for sharing your secret!");
//     await res.redirect("/login");
// });
 
app.get("/logout",async function(req,res){
    res.redirect("/login");
});

app.listen(4000,function(){
    console.log("server started");
});
