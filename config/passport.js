var passport=require('passport');
var User=require('../model/user')
var Admin=require('../model/adminlog');
var localStorage=require('passport-local').Strategy;
var bcrypt=require('bcryptjs')

//serialize & deseriallize
passport.serializeUser((user,done)=>{
    // console.log("kuch_hua"+user);
    done(null,user.id);
})
passport.deserializeUser((id,done)=>{
    User.find({_id:id},(err,user)=>{
        done(err,user);
    })
})

//login 
passport.use('local.userlogin',
new localStorage({usernameField:'email'},(email,password,done)=>{
   //Match User
//    console.log("Hello"+fid);
    User.findOne({email:email})
    .then(user=>{
        // console.log("hi"+user1);
        if(!user){

            return done(null,false,{message:'that email doensnot exist'});
            }
    // Match password 
    bcrypt.compare(password,user.password,(err,isMatch)=>{
        // console.log("password"+password);
        if(isMatch){
            // console.log("ismatch"+isMatch);
            return done(null,user);               
        }
        else {
            return done(null,false,{message:'Password is incorrect'});
             }                               
            })
    })
    .catch((err)=>console.log(err));
}));

//Admin Login
passport.use('local.adminlogin',
new localStorage({usernameField:'email'},(email,password,done)=>{
   //Match User
//    console.log("Hello"+fid);
    Admin.findOne({email:email})
    .then(user=>{
        // console.log("hi"+user1);
        if(!user){

            return done(null,false,{message:'that email doensnot exist'});
            }
    // Match password 
    bcrypt.compare(password,user.password,(err,isMatch)=>{
        // console.log("password"+password);
        if(isMatch){
            // console.log("ismatch"+isMatch);
            return done(null,user);               
        }
        else {
            return done(null,false,{message:'Password is incorrect'});
             }                               
            })
    })
    .catch((err)=>console.log(err));
}));