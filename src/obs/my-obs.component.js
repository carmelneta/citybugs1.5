(function(angular){  

  var ctrl = function($firebaseArray, Auth, $mdBottomSheet) {
    var ctrl = this;
    var ref = firebase.database().ref()
      .child('users')
      .child(Auth.$getAuth().uid )
      .child('marks')   
      .limitToLast(50);    

    ctrl.obs = $firebaseArray(ref);   
    
    ctrl.obs.$loaded().then( function(data) { 
      if(!data.length) { ctrl.openBottomSheet(); }
    });

    
    ctrl.obs.$watch(function(event) {
      if(!ctrl.obs.length) { ctrl.openBottomSheet(); }
    });

    ctrl.empty = $index => ctrl.obs.$remove( ctrl.obs[$index] );
    

    ctrl.openBottomSheet = function() {
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


    ctrl.$onDestroy = function () {
      ctrl.obs.$destroy();
    };

  };

  angular.module('cityBugs').component( 'obs.marked.component',{
    template: `

      <md-toolbar class="md-warn">
        <div class="md-toolbar-tools">
          <h2 class="md-flex">Marked Observations</h2>
        </div>
      </md-toolbar>

      <md-content class="md-padding" layout="row" layout-wrap> 
        <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob-id="ob.$id" on-empty="$ctrl.empty($index)"></ob-card>
      </md-content>
    `,
    controller: ctrl
  });
})(window.angular);