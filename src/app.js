var app = angular.module('cityBugs', ['ui.router', 'ngMaterial', 'firebase', 'ngMessages']);
 


app.config(function( $stateProvider ) {

  var homeState = {
    name: 'home',
    url: '/',
    component: 'home.component'    
  };

  var obsIndexState = {
    name: 'obs',
    url : '/obs',
    component: 'obs.index'
  }

  
  var userState = {
    name: 'user',
    url : '/user',
    component: 'user.index'
  }


  $stateProvider.state(homeState); 
  $stateProvider.state(obsIndexState); 
  $stateProvider.state(userState); 

});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange');
});
 