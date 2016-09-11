angular.module('cityBugs')
  .component('mainApp', {    
    templateUrl: 'src/main/main.component.html',
    controller: function( $mdSidenav ) {

      console.log('main component Loaded');
      var ctrl = this;

      ctrl.leftNavOpen = false;

      ctrl.toggleDrew = function() {
        $mdSidenav('left').toggle();
      }
      
    }
  })
;


