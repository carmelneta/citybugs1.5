(function(angular) {
  var ctrl = function(){  };
  
  angular.module('cityBugs').component('obs.view.component', {
    bindings: { obId: '<' },
    template: `
      <ob-card ob-id="$ctrl.obId"></ob-card>
      <ob-map ob-id="$ctrl.obId"></ob-map>
      <ob-comments ob-id="$ctrl.obId"></ob-comments>
    `,
    controller: ctrl
  }); 
 
})(window.angular);