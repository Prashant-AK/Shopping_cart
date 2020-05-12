var createError = require('http-errors');
var express = require('express');
var exphbs=require('express-handlebars');
var session=require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash=require('connect-flash');
var mongoose=require('mongoose');
var app = express();
var passport=require('passport');
const Handlebars = require('handlebars');
var MongoStore=require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');


//Mongoose Connection 
mongoose.connect('mongodb://localhost:27017/Cart',{useNewUrlParser:true, useUnifiedTopology: true},(err)=>{
    if(err) throw err;
    console.log("MongoDB Connected");    
});

// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

//Our Passport
require('./config/passport');
// view engine setup
app.engine('.hbs',exphbs({defaultLayout:'layout',extname:'.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'zip',
  resave:'false',
  saveUninitialized:false,
  store:new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie:{maxAge:60 *60 *1000}
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.message=req.session.message
  delete req.session.message
  next()
});

//Global variable to check authenticatio  --which help in changing the header {button --login logout}
//It always be written befrote the other route so that it always 
// console.log("incoming");
app.use('/',(req,res,next)=>{
  // console.log("globally aaya");
  res.locals.login = req.isAuthenticated(); //--> here {res.locals.login} act as variable which act as object with name "login"
  res.locals.session = req.session;
  // console.log(req.isAuthenticated());
  // console.log("ha mei chal raha hoon globally");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
