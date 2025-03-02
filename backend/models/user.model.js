const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=({
    fullName:{type:String},
    email:{type:String},
    password:{type:String},
    createdOn:{type:Date,default:Date.now()},
});

module.exports=mongoose.model("user",userSchema);