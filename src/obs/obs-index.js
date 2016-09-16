(function(angular){

  var app = angular.module('cityBugs');  

  app.config(function($stateProvider) {

    var viewState = {
      name: 'obs.view',
      url: '/view/{obId}',
      component: 'obs.view.component',
      resolve: { 
        obId: $transition$ => $transition$.params().obId
      }
    };

    var editState = {
      name: 'obs.edit',
      url: '/edit/{obId}',
      component: 'obs.edit.component',
      resolve: {
        currentAuth: Auth => Auth.$requireSignIn(),
        obId: $transition$ => $transition$.params().obId
      }
    };

    var addState = {
      name: 'obs.add',
      url: '/add',
      component: 'obs.add.component',
      resolve: {
        currentAuth: Auth => Auth.$requireSignIn()
      }
    };

    var myObsState = {
      name: 'obs.marked',
      url: '/marked',
      component: 'obs.marked.component',
      resolve: {
        currentAuth: Auth => Auth.$requireSignIn()
      }
    }

    $stateProvider.state(viewState); 
    $stateProvider.state(addState); 
    $stateProvider.state(editState); 
    $stateProvider.state(myObsState); 
  });

  

  app.component('obs.index', { template: '<ui-view></ui-view>' }); 

})(window.angular);