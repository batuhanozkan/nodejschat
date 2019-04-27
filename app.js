const express = require('express')
const app = express()
var session = require('express-session');
app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true
}));
//app.use(session({secret: 'your secret', saveUninitialized: true, resave: false}));
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/database',{useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});
//set the template engine ejs
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//middlewares
app.use(express.static('views'))
//app.use(express.static(__dirname + '/views'));
var User = require('./models/user');
var Message = require('./models/message');



var clients = [];
var veri;
var kullaniciadi;
var sifre;
var si;

server = app.listen(3000)
// app.get('/', function (req, res, next) {
//   res.render('index')
// });

var routes = require('./routes/router');
app.use('/', routes);

// app.get('/deneme/:socId', function (req, res, next) {
//   console.log(req.params.socId);
 
//  // res.render('chat1');  
// });
//<a href="../deneme/<%= user.socId %>">
//POST route for updating data
app.post('/', function (req, res, next) {
  //console.log(req);
console.log("burda");
var ornek="deneme"

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
        res.render('chat',{ name: user.socId});
        
      }
    });

  } else if (req.body.logemail && req.body.logpassword) { //LOGIN
      
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
        kullaniciadi=req.body.logemail;
        sifre=req.body.logpassword;
        

        //app.set('ku',req.body.logemail);
        User.find({}, function(err, users) {
          Message.find({},function(err,messages) {
          
      
          // users.forEach(function(user) {
          //   console.log(user.username);
          // });
      
          res.render('chat',{ users:users,messages:messages });  
        });
      });
        
        
      }
      
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})






const io = require("socket.io")(server)

io.on('connection', function (socket) {
  User.authenticate(kullaniciadi, sifre, function (error, user) {
    
    user.socId=socket.id;
    user.username=kullaniciadi;
    user.password=sifre;
    user.save();
    });
    console.log('New user connected')
    clients.push(socket.id);
    
    veri=socket.id;
    console.log("benim VERİM BURADA: "+ veri);
    app.set('ornek', veri);
   
	//default username
    socket.username = kullaniciadi
   
    console.log(socket.id);
    io.sockets.emit('kullaniciadi', {username : socket.username})
    

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
      var messageData = {
        receiver: kullaniciadi,
        sender: "everyone",
        message:data.message,
      }
  
      Message.create(messageData)
        //broadcast the new message
        socket.emit('new_message2', {message : data.message, username : socket.username});
        
        socket.broadcast.emit('new_message1', {message : data.message, username : socket.username});
        //io.sockets.socket(clients[2]).emit(message);
        //io.to(clients[1]).emit('new_message2',{message : data.message, username : socket.username});
        //io.to(clients[2]).emit('new_message1',{message : data.message, username : socket.username});
    })
    // socket.on('private_message', (data) => {
    //   //console.log(data.alan)
      
    //     socket.emit('ekran_degis', {username : data.alan});
    //     //console.log(user);
    
    // })
    socket.on('private_message1', (data) => {
      console.log("SON AsAMADAYIZ "+data.username)
      User.findOne({username: data.username}, (err, user) =>{
        if (err) return res.status(500).send(err)
        console.log("dBAKALIM "+data.gonderen)
        socket.broadcast.to(user.socId).emit('private_message2',{message : data.message, username : kullaniciadi,gonderen:socket.username});
        socket.emit('new_message2', {message : data.message, username : socket.username});
      });
    })

    //listen on typing
    socket.on('typing', (data) => {
    	io.sockets.emit('typing', {username : socket.username})
    })
})


console.log("benim VERİM BURADA: "+ veri);

//module.exports = veri;
// parse incoming requests


//routes
// app.get('/', (req, res) => {
// 	res.render('index')
// })

//Listen on port 3000






