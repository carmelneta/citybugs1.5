(function(angular){

  angular.module('cityBugs').component('user.login', {
    template: ` 
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
      </div>

      <section layout="row" layout-sm="column" layout-align="space-between center" layout-wrap> 
        <md-button ng-click="$ctrl.login()" ng-disabled="!$ctrl.loginForm.$valid" class="md-raised md-primary">Login</md-button> 
        <md-button ng-click="$ctrl.join()"  ng-disabled="!$ctrl.loginForm.$valid" class="md-raised md-warn" >Join</md-button> 
        <md-progress-circular ng-show="$ctrl.loadin" class="md-accent" md-diameter="40"></md-progress-circular>
      </section>
      <pre>{{$ctrl.user | json}}</pre>
      
      <pre>{{$ctrl.loginForm.email.$error || json}}</pre>

      <h1 ng-show="$ctrl.isLoggedIn">Loggedn On</h1>
      `,
    controller: function( Auth ) {
       var ctrl = this;
       ctrl.isLoggedIn = false;
       ctrl.user = {
         email: 'carmelneta@gmail.com', //null,
         password: 'status',// null
       }

      //  ctrl.isLoggedIn = userService.isLoggedIn;

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

            })
            .catch(function(error) {
              console.log("Authentication failed:", error);
              ctrl.response.error[error.code] = true;
              ctrl.loading = false;
            });
       }

       ctrl.join = function(isLoggedIn) {
        //  alert("asd");
        // userService.isLoggedIn = !userService.isLoggedIn;
        // ctrl.isLoggedIn = !ctrl.isLoggedIn;
       }

       
      // any time auth state changes, add the user data to scope
      Auth.$onAuthStateChanged(function(firebaseUser) {
        ctrl.isLoggedIn = firebaseUser;
      });  
    }
  }); 

})(window.angular);