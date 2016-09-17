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
     <obs-map obs="$ctrl.obs"></obs-map>
      <md-content class="md-padding" layout="row" layout-wrap>
        <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob="ob"></ob-card>
      </md-content>
  `  
}