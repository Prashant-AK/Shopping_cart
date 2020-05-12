var mongoose = require('mongoose');


var userSchema =new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    phno:{type:Number, required:true}
});

var Admin = mongoose.model('admin',userSchema);
module.exports = Admin;