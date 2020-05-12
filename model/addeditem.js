var mongoose = require('mongoose');

var prodSchema =new mongoose.Schema({
    title:{type:String, required:true},
    imgpath:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true}
});

var prod = mongoose.model('Product',prodSchema);
module.exports = prod;