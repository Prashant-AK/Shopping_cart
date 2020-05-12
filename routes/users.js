var express = require('express');
var router = express.Router();
var Product=require('../model/addeditem');
var Cart=require('../model/cart');


function isLoggedIn(req,res,next){
  // console.log("hello"+req.isAuthenticated())
  if(req.isAuthenticated())
  return next()
  else
  res.redirect('/');
}

//Add Items to cart
router.get('/add-to-cart/:id',(req,res,next)=>{
  // console.log('chala kya');
  var proudctId = req.params.id;
  console.log("productid:"+proudctId);
  var cart = new Cart(req.session.cart ? req.session.cart:{});
  Product.findById(proudctId,(err,product)=>{
      // if(product){console.log("product mila hai")}
    if(err){
    res.redirect('/');
    }
    cart.add(product,proudctId);
    req.session.cart = cart;
    // console.log(req.session.cart);  //consoling cart session
    res.redirect('/');
  })
  // res.json("working")
  })

  //Cart request
  router.get('/shopping-cart',(req,res,next)=>{
    if(!req.session.cart){
      return res.render('shop/shopping_cart',{products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping_cart',{products:cart.generateArray(),totalPrice:cart.generateArray(),totalPrice:cart.totalPrice})
  })

//Checkout functioning
// router.get('/checkout',isLoggedIn,(req,res)=>{
//   if(!req.session.cart){
//     return res.redirect('/shopping-cart',{products:null});
//   }
//   var cart = new Cart(req.session.cart);
//   res.render('shop/checkout',{totalPrice:cart.totalPrice});
// });

module.exports = router;

