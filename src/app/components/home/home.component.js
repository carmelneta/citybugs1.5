class HomeCtrl {
  constructor ( $firebaseArray ) {
    'ngInject';
    
    // console.log('Home Compoennet');

    this._$firebaseArray = $firebaseArray;
  }

  $onInit() {
    var ref = firebase.database().ref().child("obs").limitToLast(10);    
    this.obs = this._$firebaseArray(ref); 
  }
  
}


export const HomeComponent = {
  controller: HomeCtrl,
  template: `
    <header layout  layout-align="center center">
      <h1 flex>Fixing OUR Cities.</h1>
    </header>
    <div class="actions" layout  layout-align="center center">
      <a ui-sref="main.obs.add">
        <md-button class="md-primary md-raised">
          Report a CityBug 
          <md-icon>add</md-icon>
        </md-button>
      </a>
    </div>
    <obs-map obs="$ctrl.obs"></obs-map>
    <md-content class="md-padding" layout="row" layout-wrap>
      <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob="ob"></ob-card>
    </md-content>

    <style>
    page-home .actions {
      min-height: 10vh;
    }
    page-home header {
      background-image: url(assets/main.jpg);
      min-height: 80vh;
      background-size: cover;
    }

    page-home header h1 {
      text-align: center;
      font-size: 90px;
      margin: 0;
      color: #bd4f4f;
      font-weight: bold;
      text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
    }
    </style>
  `  
}