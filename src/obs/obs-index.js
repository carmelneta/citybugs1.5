(function(angular){

  var app = angular.module('cityBugs');  

  app.config(function($stateProvider) {

    var viewState = {
      name: 'obs.view',
      url: '/view/{obId}',
      component: 'obs.view.component',
      resolve: {
        ob : function(obsService, $transition$) {
          return obsService.getOb($transition$.params().obId);
        }
      }
    };

    var addState = {
      name: 'obs.add',
      url: '/add',
      component: 'obs.add.component'
    }

    $stateProvider.state(viewState); 
    $stateProvider.state(addState); 
  });

  

  app.component('obs.index', { template: '<ui-view></ui-view>' }); 

})(window.angular);