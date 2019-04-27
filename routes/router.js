var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ana = require('../app.js');


//var User = require('../models/user');


// GET route for reading data
router.get('/', function (req, res, next) {
    res.render('index')
});
//POST route for updating data
router.post('/', function (req, res, next) {
    //console.log(req);
  console.log("burda");
  var ornek = req.app.get('ornek');
  console.log(ornek);
  
  //console.log(req.body.logemail);
    if (req.body.username &&
      req.body.password) {
      var userData = {
        username: req.body.username,
        password: req.body.password,
        socId:ornek,
      }
  
      User.create(userData, function (error, user) {
          //console.log("jskd");
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          console.log("registerdayız");
          res.render('chat',{ name: user.socId });
          
        }
      });
  
    } else if (req.body.logemail && req.body.logpassword) {
        console.log("sıkıntı yok");
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
          console.log(user);
        if (!user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          user.socId=ornek;
          user.username=req.body.logemail;
          user.password=req.body.logpassword;
          user.save();
          //app.set('ku',req.body.logemail);
          User.find({}, function(err, users) {
            
        
            // users.forEach(function(user) {
            //   console.log(user.username);
            // });
        
            
          });
          //res.render('chat',{ name: user.socId });
          next()
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })
  

  router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            return res.send('<h1>Name: </h1>' + user.username + '<br><a type="button" href="/logout">Logout</a>')
          }
        }
      });
  });
  
module.exports = router;