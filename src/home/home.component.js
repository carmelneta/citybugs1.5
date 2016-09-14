(function(angular) {

  var ctrl = function($firebaseArray) {
   
    var ref = firebase.database().ref().child("obs").limitToLast(5);
    
    this.obs = $firebaseArray(ref); 
    // console.log(this.obs);
  };


  angular.module('cityBugs').component('home.component', {
    // templateUrl: 'src/home/home.compenent.html',
    template: `
      <md-content class="md-padding" layout="row" layout-wrap>
        <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob-id="ob.$id"></ob-card>
      </md-content>
    `,
    controller: ctrl
  });  
})(window.angular);