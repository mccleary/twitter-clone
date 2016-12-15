
const user = mongoose.model('user', {
  _id : String,
  password : String,
  following : [{type:String, unique: true}],
  followers : [{type:String, unique: true}]
});

const tweet = mongoose.model('tweet', {
  text : String,
  timestamp : Date,
  username : String
});

//world tweet
tweet.find().limit(20)
.then(function(twt){
  console.log(twt.text);
  console.log(twt.timestamp);
  console.log(twt.username);
});

//profile page
Promise.all([
  tweet.find({username : Theuname}).limit(20),
  user.find({username : Theuname})
])
.spread(function(twt,usr){
  twt.forEach(function(t){
    console.log(t);
  });
  //number of people you are following
  console.log(usr.following.length());
  //number of people following you
  console.log(usr.followers.length());
});

//followers //following
user.find({_id : Theuname}).then(function(usr){
  user.find({_id : Theuname}).then(function(usr){
    usr.following.forEach(function(u){
      console.log(u);
    });
  });
});


//user timeline
user.findById(Theuserid)
.then(function(usr){
  return tweet.find({
    username : {
      $in : usr.following.concat([usr._id])
    }
  });
}).then(function(tweets){
  console.log(tweets);
});




var jess = {
  _id : 'jess',
  password : 'jess12',
  followers : [],
  following : ['trista']
};

var keyur = {
  _id : 'keyur',
  password : 'keyur12',
  followers : ['trista'],
  following : []
};

var ttweet = {
  text : 'Good Evening',
  timestamp : new Date(),
  username : 'trista'
};

var trista = {
  _id : 'trista',
  password : 'trista12',
  followers : ['keyur'],
  following : ['keyur']
};
