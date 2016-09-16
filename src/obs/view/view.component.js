(function(angular) {
  var ctrl = function($mdBottomSheet, obsService, $timeout) {
    var ctrl = this;
    
    function _openBottomSheet() {
      $mdBottomSheet.show({
        
        template: `
          <md-bottom-sheet class="md-grid" layout="column">
          <div layout="row" layout-align="center center" ng-cloak>
            <h4>Errr, No results found...</h4>
          </div>
          <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>
            <a ui-sref="obs.add">
              <md-button class="md-fab" aria-label="Eat cake">
                  <md-icon>add</md-icon>
              </md-button>
            </a>

            <a ui-sref="home">
              <md-button class="md-fab" aria-label="Eat cake">
                  <md-icon>home</md-icon>
              </md-button>
            </a>

          </section>
        </md-bottom-sheet>
        `
      });
    };
    ctrl.ready = false;

    ctrl.$onInit = function(){
      
      ctrl.ob = obsService.getOb(ctrl.obId);
      
      ctrl.ob.$loaded().then(x => {
        ctrl.ready = true;
        if(x.$value === null) { $timeout( () => _openBottomSheet() ); }
      });
    }
 
    ctrl.$onDestroy = function () {
      ctrl.ob.$destroy();
    };
  };
  
  angular.module('cityBugs').component('obs.view.component', {
    bindings: { obId: '<' },
    template: `
      <div ng-if="$ctrl.ready">
        <ob-card ob="$ctrl.ob" more-actions="true"></ob-card>
        <obs-map ob="$ctrl.ob"></obs-map>
        <ob-comments ob-id="$ctrl.obId"></ob-comments>
      </div>

      <div ng-show="!$ctrl.ready">Loading</div>
    `,
    controller: ctrl
  }); 
 
})(window.angular);