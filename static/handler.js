var app = angular.module('twitterapp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state({
    name: 'login',
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginController'
  })
  .state({
    name: 'profile',
    url: '/profile',
    templateUrl: 'profile.html',
    controller: 'ProfileController'
  })
  .state({
    name: 'mytimeline',
    url: '/timeline',
    templateUrl: 'mytimeline.html',
    controller: 'MyTimelineController'
  })
  .state ({
    name: 'worldtimeline',
    url: '/worldtimeline',
    templateUrl: 'worldtimeline.html',
    controller: 'WorldTimeLineController'
  });
  $urlRouterProvider.otherwise('/index');
});

app.factory('twitterfactory', function($http) {
  var service = {};
  service.worldtimeline = function(){
    return $http({
      url: '/worldtimeline',
      method: 'GET'
    });
  };
// added services - tm //
  service.mytimeline = function(){
    return $http({
      url: '/timeline',
      method: 'GET'
    });
  };

  service.profile = function(){
    return $http({
      url: '/profile',
      method: 'GET'
    });
  };
// end of added services //
  return service;
});

app.controller('WorldTimeLineController',function($scope,$state,twitterfactory) {
  twitterfactory.worldtimeline()
  .success(function(tweets){
    $scope.tweets = tweets;
  });
});
// added controller info- start //
app.controller('MyTimelineController', function($scope,$state, twitterfactory) {
  twitterfactory.mytimeline()
  .success(function(tweets){
    console.log('new timeline tweets', tweets);
  });
});

app.controller('ProfileController', function($scope,$state, twitterfactory) {
  twitterfactory.mytimeline()
  .success(function(newTweets) {
    console.log('these are my tweets', newTweets);
    $scope.newTweets = newTweets;
  });
});
//  end of added controller info
