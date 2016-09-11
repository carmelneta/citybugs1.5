(function(angular){

  var app = angular.module('cityBugs');  

  app.config(function($stateProvider) {

    var loginState = {
      name: 'user.login',
      url: '/login',
      component: 'user.login'
    }; 

    $stateProvider.state(loginState);  
  });

  

  app.component('user.index', { template: '<ui-view></ui-view>' }); 

})(window.angular);