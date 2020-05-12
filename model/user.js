var mongoose = require('mongoose');
var bcrypt =require('bcryptjs');

var userSchema =new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    phno:{type:String, required:true}
});

var user = mongoose.model('user',userSchema);
module.exports = user;