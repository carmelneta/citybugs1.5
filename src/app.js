var app = angular.module('cityBugs', ['ui.router', 'ngMaterial', 'firebase']);




app.config(function($stateProvider) {

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

  $stateProvider.state(homeState); 
  $stateProvider.state(obsIndexState); 
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange');
});
 

;


