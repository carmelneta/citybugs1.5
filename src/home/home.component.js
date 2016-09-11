(function(angular) {
  var ctrl = function($firebaseArray) {
   
    var ref = firebase.database().ref().child("obs").limitToLast(2);

    this.obs = $firebaseArray(ref);

    console.log(this.obs);
    
    

  };


angular.module('cityBugs').component('home.component', {
    templateUrl: 'src/home/home.compenent.html',
    bindings: { people: '<' },
    controller: ctrl
  }); 




})(window.angular);