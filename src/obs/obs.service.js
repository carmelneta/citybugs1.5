var myModule = angular.module('cityBugs')
.factory('obsService', function($firebaseObject) {
  
  const actions = {

    getOb: function(obId) {
      var ref = firebase.database().ref().child('obs');
      
      return $firebaseObject(ref.child( obId ));
    }
  }   
  
  return actions;
});