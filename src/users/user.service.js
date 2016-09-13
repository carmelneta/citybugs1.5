var myModule = angular.module('cityBugs')
 
.factory("Auth", function($firebaseAuth) {
  return $firebaseAuth();
})


.factory("UserService", function(Auth, $firebaseObject, $firebaseArray) {

  const actions = {
    addMarked: function(obId) {
      var ref = firebase.database().ref().child('users').child(Auth.$getAuth().uid ).child('marked');

      // var userOb = $firebaseObject( ref );
      
      // var list = $firebaseArray(ref).$add(obId);
      // console.log(obId);    
      // console.log(ref);    
      // console.log(list);    
    }
  }

  return actions;
});