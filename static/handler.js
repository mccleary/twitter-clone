var app = angular.module('twitterapp',['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state({
    name: 'profile',
    url: '/profile/{username}',
    templateUrl: 'profile.html',
    controller: 'ProfileController'
  })
  .state({
    name: 'mytimeline',
    url: '/mytimeline/{username}',
    templateUrl: 'mytimeline.html',
    controller: 'MyTimelineController'
  })
  .state({
    name:'signup',
    url: '/signup',
    templateUrl:'signup.html',
    controller:'SignUpPostController'
  })
  .state ({
    name: 'worldtimeline',
    url: '/worldtimeline',
    templateUrl: 'worldtimeline.html',
    controller: 'WorldTimeLineController'
  });
  $urlRouterProvider.otherwise('/worldtimeline');
});

app.factory('twitterfactory', function($http,$cookies,$rootScope) {
  var service = {};
  $rootScope.loggedIn = false;
  var logindata = $cookies.getObject('user_cookie');

  if(logindata){
    service.auth_token = logindata.auth_token.token;
    }
    $rootScope.logOut = function(){
    $rootScope.loggedIn = false;
    service.auth_token = null;
    $cookies.remove('user_cookie');
  };

  service.worldtimeline = function(){
    return $http({
      url: '/worldtimeline',
      method: 'GET'
    });
  };

  service.postTweet = function(twt){
    var url = '/profile/'+twt.user;
    console.log(twt);
    return $http({
      url : url,
      method : 'POST',
      data : twt
    });
  };

  service.signUp = function(data){
    var url = '/signup';
    return $http({
      url : url,
      method : 'POST',
      data : data
    });
  };

  service.incrementlikes = function(id){
    var url = '/likes';
    return $http({
      url : url,
      method : 'POST',
      data : id
    });
  };

  service.logIn = function(data){
    var url = '/login';
    return $http({
      url : url,
      method : 'POST',
      data : data
    }).success(function(data){
      $rootScope.loggedIn = true;
      service.auth_token = data.auth_token;
      $cookies.putObject('logindata',data);
    });
  };

  service.mytimeline = function(uname){
    var url = '/timeline/'+uname;
    return $http({
      url : url,
      method : 'GET'
    });
  };

  service.profiles = function(username){
    var url = '/profile/'+username;
    return $http({
      url: url,
      method: 'GET'
    });
  };
  return service;
});

// app.controller('LoginController',function($scope,$state,$stateParams,twitterfactory){
//
// });

app.controller('SignUpPostController',function($scope,$state,$stateParams,twitterfactory){
  $scope.signuppost = function(){
    if($scope.password === $scope.password_again){
      user = {username : $scope.uname, password : $scope.password};
      twitterfactory.signUp(user).success(function(data){
      });
      $state.go('worldtimeline');
    }else{
      alert("Passwords do not match");
      $state.go('signup');
    }
  };

});

app.controller('MyTimelineController',function($scope,$stateParams,twitterfactory){
  twitterfactory.mytimeline($stateParams.username).success(function(data){
    $scope.tweets = data;
  });
});

app.controller('WorldTimeLineController',function($scope,twitterfactory,$state) {
  twitterfactory.worldtimeline().success(function(tweets){
    $scope.tweets = tweets;
  });

  $scope.loginPost = function(){
    user = {username : $scope.usr, password : $scope.password};
    twitterfactory.logIn(user).success(function(data){
      $state.go('profile',{username : $scope.usr});
    });
  };

  $scope.likes = function(id){
    twt_id = {id : id};
    twitterfactory.incrementlikes(twt_id).success(function(data){

    });
  };
});

app.controller('ProfileController',function($scope,$stateParams,twitterfactory){
  twitterfactory.profiles($stateParams.username).success(function(data){
    $scope.profile = data;
  });
  $scope.posttwt = function()
  {
    var twt = {user : $stateParams.username, twt : $scope.areatwt };
    twitterfactory.postTweet(twt).success(function(data){
      twitterfactory.profiles($stateParams.username).success(function(data){
        $scope.profile = data;
      });
    });
  };
});
