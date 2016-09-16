var myModule = angular.module('cityBugs')
 
.factory("Auth", $firebaseAuth => $firebaseAuth() )


.factory("UserService", function(Auth, $firebaseObject, $firebaseArray) {

  const actions = {
    
    addMark: function(obId) {
      var ref = firebase.database().ref()
        .child('users')
        .child(Auth.$getAuth().uid )
        .child('marks')      
        .child(obId);
      ;      
      
      var obj = $firebaseObject(ref); 
      obj.added = firebase.database.ServerValue.TIMESTAMP;
      obj.$save();
    },

    removeMark: function(obId) {
      var ref = firebase.database().ref()
        .child('users')
        .child(Auth.$getAuth().uid )
        .child('marks')      
        .child(obId);
      ;      
      
      $firebaseObject(ref).$remove();      
    }
  }

  return actions;
});