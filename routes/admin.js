var express = require('express');
var router = express.Router();
var path=require('path');
var multer=require('multer');
var passport=require('passport');
var bcrypt=require('bcrypt');
var Admin=require('../model/adminlog');
var Product=require('../model/addeditem');

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

//Home page for admin
router.get('/panel',(req,res)=>{
  res.render('admin/adminpannel');
})

//Admin Register
router.get('/signup',(req,res)=>{
    res.render('admin/adminsignup');
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
        const newUser = new Admin({
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
                  intro:'Registered',
                  message:'You are registered and can log in now'
                }
                res.redirect('/admin/signup');
            })
            .catch(err=>console.log(err));
            })
        })
        
    }
  })

//Admin Login, Profile Route
router.get('/login',notLoggedIn,(req,res)=>{
    res.render('admin/adminlogin');
  });
  router.post('/login',passport.authenticate('local.adminlogin',{
    successRedirect:'/admin/profile',
    failureRedirect:'/admin/login',
    failureFlash:true
  }));

  //Admin_Profile  
  router.get('/profile',isLoggedIn,(req,res,next)=>{
    res.render('admin/adminprofile');
    });

//Display Product list
router.get('/display',isLoggedIn,(req,res)=>{
  Product.find(function(err,docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0;i<docs.length;i=i+chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize))
      // console.log(productChunks);
    } 
    res.render('admin/admin_disp_prod',{ products:productChunks });
  });  
});

//Delete Product
router.get('/delete/:id',isLoggedIn,(req,res)=>{
  // console.log("ha bhai delete button pressed")
   Product.findOneAndDelete({_id: req.params.id},(err,result)=>{
    //  console.log("id is searched in Product")
    if(err) throw err;
    else{
      res.redirect('/user/display')
    }
  });
});

//Edit Product
router.get('/edit/:id',isLoggedIn,(req,res)=>{
  Product.findById(req.params.id,(err,docs)=>{
      if(err) throw err;
      res.render('admin/admin_addprod',{docs});    
  });
});

//To Add Item in database 
router.get('/additem',isLoggedIn,(req,res)=>{
    res.render('admin/admin_addprod')
  });

//Uploading Product and saving to database
var storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
  });
  var upload= multer({storage:storage});
  
  //Add item 
  router.post('/additem/',isLoggedIn,upload.single('image'),(req,res,next)=>{
    // console.log("in post chala");
    if(req.body._id==""){
      // console.log("in if condition");
    const {title,description,price} = req.body;
    const file=req.file;
    let errors = [];
    var filepath=path.join('/uploads')+'/'+req.file.filename;//creating path /uploads/fdksjfka.jpeg
    if(!file){
      errors.push({msg:'You are now register and can log in'});
    }
    if(!title|| !description || !price){
      errors.push({msg:'Please Fill all the fields'})
      }
    if(errors.length>0){
       res.render('admin/admin_addprod',{errors,title,description,price});
    }
    
    else{
      const newUser = new Product({
          title,
          imgpath:filepath,
          description,       
          price
      })
      
      // console.log(filepath);
      newUser.save();
  
    }
    res.render('admin/adminprofile');
  }
  else
{
    
    // console.log("Hello bro" + req.body._id);
    Product.findOneAndUpdate({_id:req.body._id},req.body,{new: true, useFindAndModify: false},(err,docs)=>{
      // console.log("hello" +  docs);  
        // if(!err){ res.redirect('/admin/display'); } 
        if(err) throw err;
        else{
          res.redirect('/admin/display');
        }
    })
}
    // res.json(filepath)
  });
  
  // router.get('/test',(req,res)=>{
    
  //   res.render('index');
  // });
  // router.post('/test',(req,res)=>{
  //   // req.flash('success', 'Button is pressed');
  //   // // let errors=[];
  //   // // errors.push({msg:'You are now register and can log in'})
  //   // res.redirect('/')
  //   if(req.body.name ==''){
  //     req.session.message={
  //       type:'success',
  //       intro:'Working',
  //       message:'Hurray! Its working'
  //     }

  //   }
    
  //   res.redirect('/admin/test');
  // });
module.exports = router;