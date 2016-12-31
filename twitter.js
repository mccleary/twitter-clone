// connection client for mongodb
const mongoose = require('mongoose');
// promise library
const bluebird = require('bluebird');
//initializing express module
const express = require('express');
//initializing bodyParser module
const bodyParser = require('body-parser');
//initializing the app
const app = express();
// bcrypt module
const bcrypt = require('bcrypt');
// Number of Salt Rounds
const saltRounds = 12;
// Generate rand-token
const uid = require('rand-token').uid;

var tokenobj = {};

//assign bluebird to promise
const Promise = bluebird;

mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/twitter');

// To pass the object as json
app.use(bodyParser.json());
// app.use(bodyParser());

//to tell express the location of all the html views folder
app.use(express.static('static'));


const user = mongoose.model('user', {
  _id : String,
  password : String,
  token : String,
  token_added_on : Date,
  following : [{type:String, unique: true}],
  followers : [{type:String, unique: true}]
});


const tweet = mongoose.model('tweet', {
  text : String,
  timestamp : Date,
  username : String,
  likes_counter : Number
});



app.get('/worldtimeline',function(req,res){
  let tweets = [];
  tweet.find()
  .then(function(twt){
    twt.forEach(function(twt){
      tweets.push(twt);
    });
    res.send(tweets);
  });
});

app.post('/login',function(req,res){
  let token = uid(16);
  let id = req.body.username;
  let pwd = req.body.password;
  user.findById(id)
  .then(function(data){
    return bcrypt.compare(pwd,data.password);
  })
  .then(function(match){
    if(match){
      return user.update(
          { _id: id },
          { $set: { token : token , token_added_on : new Date()} }
        )};
      })
  .then(function(auth_token){
    res.send(token);
  })
  .catch(function(err){
    res.send("Error"+err.stash);
  });
});

function authCheck(req,res,next){
  let token = req.query.auth_token;
  user.find({token : token}).then(function(data){
    if(data){
      console.log("Logged in");
      next();
    }
    else{
      res.send("Please log in");
    }
  });
}
///------------------ Timeline Tweets:

app.get('/timeline/:username',authCheck,function(req,res){
  let tweets = [];
  user.findById(req.params.username).limit(20)
  .then(function(usr){
    return tweet.find({
      username : {
        $in : usr.following.concat([usr._id])
      }
    });
  }).then(function(tweets){
    res.send(tweets);
  });
});

app.post('/likes',authCheck,function(req,res){
  let id = req.body.id;
  return tweet.update(
      { _id: id },
      { $inc: { likes_counter : 1} }
    )
.then(function(res){
  res.send(id);
})
.catch(function(error){
  // if(error){
  //   console.log(error.stash);
  // }
});

});

app.get('/profile/:username',authCheck,function(req,res){
  let mytweets = [];
  Promise.all([tweet.find({username : req.params.username}).limit(20),
  user.findOne({_id : req.params.username})
])
.spread(function(twt,usr){
    twt.forEach(function(t){
      mytweets.push(t);
    });
  res.send({mytweets : mytweets, usr : usr});
  });
});

app.post('/profile/:username',authCheck,function(req,res){
  let twt = new tweet();
  twt.text = req.body.twt;
  twt.timestamp = new Date();
  twt.username = req.params.username;
  twt.save().then(function(){
  console.log("Post Successful");
  res.json(twt);
  });
});

app.post('/signup',function(req,res){
  let usr = new user();
  bcrypt.hash(req.body.password,saltRounds).then(function(hash){
    usr.password = hash;
    console.log("hash"+hash);
    }).then(function(){
      usr._id = req.body.username;
      console.log(usr.password);
      usr.followers = [];
      usr.following = [];
      usr.save().then(function(){
        console.log("Signup Successful");
        res.json(usr);
    });
  });
});


// world tweet


// //profile page
// Promise.all([
//   tweet.find({username : 'trista'}).limit(20),
//   user.find({ _id : 'trista'})
// ])
// .spread(function(twt,usr){
//   twt.forEach(function(t){
//     // console.log(t);
//   });
//   //number of people you are following
//   usr[0].followers.forEach(function(f){
//     console.log(f);
//   });
//     console.log(usr[0].followers.length);
// });

// //followers //following
// user.find({_id : Theuname}).then(function(usr){
//   user.find({_id : Theuname}).then(function(usr){
//     usr.following.forEach(function(u){
//       console.log(u);
//     });
//   });
// });
//
//
// //user timeline


app.listen(3000,function(){
  console.log('Example app listening on port 3000!');
});
