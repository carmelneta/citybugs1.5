(function(angular){
  
  var ctrl = function(Auth) {
    
    var ctrl = this; 
    
    ctrl.leftNavOpen = false;
    
    ctrl.user = null;
    
    // any time auth state changes, add the user data to scope
    Auth.$onAuthStateChanged(function(firebaseUser) {
      ctrl.user = firebaseUser;
      // console.log(firebaseUser);
    });  
    
    ctrl.logout = function() {
      Auth.$signOut();
    }
  };

  angular.module('cityBugs').component('mainApp', {    
    templateUrl: 'src/main/main.component.html',
    controller: ctrl
  });

})(window.angular);
