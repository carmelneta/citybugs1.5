class MainCtrl {
  constructor ( Auth ) {
    'ngInject';
    
    console.log('MainComponent');

    this.leftNavOpen = false;
    this.user = null;
    this._Auth = Auth;

     // any time auth state changes, add the user data to scope
    Auth.$onAuthStateChanged( firebaseUser => this.user = firebaseUser );  

  }

  logout() {
    this._Auth.$signOut();
  }   
}


export const MainComponent = {
  templateUrl: 'app/main/main.html',
  controller: MainCtrl
}