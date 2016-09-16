(function(angular){
  var ctrl = function( Auth, $mdBottomSheet ) {
    var ctrl = this;

    ctrl.isLoggedIn = false;
    ctrl.user = {
      email: 'carmelneta@gmail.com',
      password: 'status',
      // email: null,
      // password: null,
    }

    
    function _openBottomSheet() {
      $mdBottomSheet.show({
        escapeToClose: false,
        clickOutsideToClose : false,
        controller: ($scope, $state, $mdBottomSheet) => {
          $scope.click = function(target){ 
            $state.go(target); 
            $mdBottomSheet.hide();
          }
        },
        template: `
          <md-bottom-sheet class="md-grid" layout="column">
          <div layout="row" layout-align="center center" ng-cloak>
            <h4>Logged in successfully!</h4>
          </div>
          <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>
            <md-button class="md-fab" aria-label="Add observation" ng-click="click('obs.add')">
                <md-icon>add</md-icon>
            </md-button>

              <md-button class="md-fab" aria-label="Home" ng-click="click('home')">
                  <md-icon>home</md-icon>
              </md-button>

          </section>
        </md-bottom-sheet>
        `
      });
    };

    ctrl.response = {error : { } };

    ctrl.login = function() {

        if(!ctrl.loginForm.$valid){
          return;
        }

        ctrl.loading = true;
        Auth.$signInWithEmailAndPassword(ctrl.user.email, ctrl.user.password)
          .then(function(firebaseUser){
            console.log(firebaseUser);
            ctrl.response.error = {};
            ctrl.loading = false; 
            _openBottomSheet();
          })
          .catch(function(error) {
            console.log("Authentication failed:", error);
            ctrl.response.error[error.code] = true;
            ctrl.loading = false;
          });
    }

    ctrl.join = function() { 
      
      if(!ctrl.loginForm.$valid){ return; }

      Auth.$createUserWithEmailAndPassword(ctrl.user.email, ctrl.user.password)
        .then(

          firebaseUser => {
            ctrl.response.error = {};
            ctrl.loading = false; 
            _openBottomSheet();
          }, 

          error => {           
            console.log(error);
            ctrl.response.error[error.code] = true;
            ctrl.loading = false;  
          }
        
        ).catch(function(error) {});
    }

    
    // any time auth state changes, add the user data to scope
    Auth.$onAuthStateChanged(function(firebaseUser) {
      ctrl.isLoggedIn = firebaseUser;
    });  

    


  };
  
  angular.module('cityBugs').component('user.login', {
    template: ` 
      <md-toolbar class="md-warn">
        <div class="md-toolbar-tools">
          <h2 class="md-flex">Login</h2>
        </div>
      </md-toolbar>

      <md-content class="md-padding" layout="row" layout-wrap> 
        <form name="$ctrl.loginForm" novalidate> 
        
          <md-input-container class="md-block">
            <label>Email</label>
            <input required md-no-asterisk type="email" name="email" ng-model="$ctrl.user.email">
            <div ng-messages="$ctrl.loginForm.email.$error">
              <div ng-message="required">Email is required.</div>
              <div ng-message="email">Email is not valid.</div>
            </div>
          </md-input-container>
        
          <md-input-container class="md-block">
            <label>Password</label>
            <input required md-no-asterisk type="password" name="password" ng-model="$ctrl.user.password">
            <div ng-messages="$ctrl.loginForm.password.$error">
              <div ng-message="required">Password is required.</div>
            </div>
          </md-input-container>
        </form>

      
        <div ng-messages="$ctrl.response.error" style="color:maroon" role="alert"> 
          <div ng-message="auth/wrong-password">Wrong Password</div>
          <div ng-message="auth/invalid-email">Wrong Email</div>
          <div ng-message="auth/argument-error">Error</div>
          <div ng-message="auth/email-already-in-use">This Email is already in use</div>
        </div>

        <section layout="row" layout-sm="column" layout-align="space-around" layout-wrap> 
          <md-button ng-click="$ctrl.login()" ng-disabled="!$ctrl.loginForm.$valid" class="md-raised md-primary">Login</md-button> 
          <md-button ng-click="$ctrl.join()"  ng-disabled="!$ctrl.loginForm.$valid" class="md-raised md-warn" >Join</md-button> 
          <md-progress-circular ng-show="$ctrl.loadin" class="md-accent" md-diameter="40"></md-progress-circular>
        </section>
      </md-content>
      <!-- <pre>{{$ctrl.user | json}}</pre> -->      
      <!-- <pre>{{$ctrl.loginForm.email.$error || json}}</pre> -->

      `,
    controller: ctrl
  }); 

})(window.angular);