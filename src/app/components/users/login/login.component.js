
class LoginCtrl {
  constructor( Auth, $mdBottomSheet ) {
    'ngInject'; 
    console.log("Login");

    this._Auth = Auth;
    this._$mdBottomSheet = $mdBottomSheet;

    this.response = {error : { } }; 
  }

  $onIint() {   
    // any time auth state changes, add the user data to scope
    this._Auth.$onAuthStateChanged( firebaseUser => this.isLoggedIn = firebaseUser );  

  }

  _openBottomSheet() {
    this._$mdBottomSheet.show({
      escapeToClose: false,
      clickOutsideToClose : false,
      controller: ($scope, $state, $mdBottomSheet) => {
        'ngInject'; 
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

            <md-button class="md-fab" aria-label="Add observation" ng-click="click('main.obs.add')">
                <md-icon>add</md-icon>
            </md-button>

            <md-button class="md-fab" aria-label="Home" ng-click="click('main.home')">
                <md-icon>home</md-icon>
            </md-button>

          </section>
        </md-bottom-sheet>
      `
    });
  }

  login() {

    if(!this.loginForm.$valid){ return; }

    this.loading = true;
    this._Auth.$signInWithEmailAndPassword(this.user.email, this.user.password)
      .then( firebaseUser => {
        // console.log(firebaseUser);
        this.response.error = {};
        this.loading = false; 
        this._openBottomSheet();
      })
      .catch( error => {
        console.log("Authentication failed:", error);
        this.response.error[error.code] = true;
        this.loading = false;
      });
  }


  join() {
    
    if(!this.loginForm.$valid){ return; }

    this._Auth.$createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(

        firebaseUser => {
          this.response.error = {};
          this.loading = false; 
          this._openBottomSheet();
        }, 

        error => {           
          console.log(error);
          this.response.error[error.code] = true;
          this.loading = false;  
        }
      
      ).catch(function(error) {});
  }
}

export const LoginComponent = {
  controller: LoginCtrl,
  templateUrl: 'app/components/users/login/login.component.html'
  // template: '<h1>CAMR</h1>'
}

