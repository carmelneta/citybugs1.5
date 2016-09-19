class HomeCtrl {
  constructor ( $firebaseArray, $firebaseObject ) {
    'ngInject';
    
    // console.log('Home Compoennet');
    this._$firebaseArray = $firebaseArray;
    this._$firebaseObject = $firebaseObject;
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
    
    <md-card-content class="actions">
      <md-card>    
        <div layout="row" layout-align="space-between center" class="md-padding">
          <span>Take Action</span>
          <a ui-sref="main.obs.add">
            <md-button class="md-primary md-raised">
              Report a CityBug             
            </md-button>
          </a>
        </div>    
      </md-card-content>
    </md-card>    

    <md-divider></md-divider>

    <obs-near></obs-near>

    <md-divider></md-divider>

    <md-content class="md-padding" layout="row" layout-wrap>
      <h4>Reacent Observations</h4>
      <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob="ob"></ob-card>
    </md-content>

    <style>
    page-home header {
      background-image: url(assets/main.jpg);
      min-height: 90vh;
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