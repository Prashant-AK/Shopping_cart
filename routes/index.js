var express = require('express');
var router = express.Router();
var passport=require('passport');
var bcrypt=require('bcrypt')
var User=require('../model/user');
var Product=require('../model/addeditem');
var Order=require('../model/order');

var i=0;
var k=0

//Checking function login or not
function isLoggedIn(req,res,next){
  // console.log("hello"+req.isAuthenticated())
  if(req.isAuthenticated())
  return next()
  else
  res.redirect('/');
}
function notLoggedIn(req,res,next){
  // console.log("hello"+i+req.isAuthenticated())
  // console.log("hello2"+k)
  if(!req.isAuthenticated())
    return next();
   else
    res.redirect('/');
}

/* GET home page. */
router.get('/', (req,res)=>{
  Product.find(function(err,docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0;i<docs.length;i=i+chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize))
      // console.log(productChunks);
    } 
    res.render('shop/disp_prod',{ products:productChunks });
  });
});

//Register Page
router.get('/signup',(req,res)=>{
  res.render('user/signup');
});
router.post('/signup',(req,res)=>{
  const {name,email,password,password2,phno} = req.body;
  let errors = [];
  if(!name|| !email || !password || !password2 ||!phno){
  errors.push({msg:'Please Fill all the fields'})
  }

  //Check password match
  if(password2 !== password){
      errors.push({msg:'Password do not match'});
  }

  //Check pass length
  if(password.length < 6)
  {
      errors.push({msg:'Password must contain more than 6 character'});
  }

  if(errors.length>0){
      // console.log("hi"+errors+"---"+fid);
      res.render('user/signup',{errors,name,email,phno,password,password2});
  }
  else{
      const newUser = new User({
          name,
          email,
          phno,
          password
      })
      
      //Hash Password
      bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(newUser.password,salt,(err,hash)=>{
          if(err) throw err;
          //Set Password to hashed
          newUser.password = hash;             
          newUser.save()
          .then(user=>{
              // console.log(newUser)
              // req.flash({msg:'You are now register and can log in'})
              req.session.message={
                      type:'success',
                      intro:'Registered Successfull!!',
                      message:'You are ready to login'
                    }
              res.redirect('/signup');
          })
          .catch(err=>console.log(err));
          })
      })
      
  }
})

//Login Route
router.get('/login',notLoggedIn,(req,res)=>{
  res.render('user/login');
});
router.post('/login',passport.authenticate('local.userlogin',{
  
  successRedirect:'/profile',
  failureRedirect:'/',
  failureFlash:true
}));

//Customer Profile
router.get('/profile',isLoggedIn,(req,res,next)=>{
  // console.log(req.user);
  // Order.find({user:req.user},function(err,orders){
  //   if(err){
  //     return res.write('Error!!!');
  //   }
  //   var cart;
  //   orders.forEach(function (order){
  //     cart = new Cart(order.cart);
  //     order.items = cart.generateArray();
  //   });
    // res.render('user/profile',{orders:orders})
  // })
      res.render('user/profile');
  });



//Logout Router
router.get('/logout',isLoggedIn,(req,res,next)=>{
  req.logout();
  res.redirect('/');
})

module.exports = router;
