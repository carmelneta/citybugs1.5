var myModule = angular.module('cityBugs')
.factory('obsService', function($firebaseObject, Auth, UserService, $firebaseArray) {
  
  const actions = {

    getOb: function(obId) {
      var ref = firebase.database().ref().child('obs');
      
      return $firebaseObject( ref.child( obId ));
    },
    
    mark: function (ob) {
      // console.log(ob);

      var ref = firebase.database().ref().child('obs/'+ ob.$id +'/marks/');
      var list = $firebaseArray(ref);
      console.log(list);

      return;


      var t = firebase.database().ref().child('obs/'+ ob.$id +'/marks/').orderByChild("username").equalTo('carmel2').limitToFirst(1);

      t.once('value')
      .then(function(dataSnapshot) { 
        console.log(dataSnapshot);
      });

      var r = $firebaseObject(t);
      console.log(t);
      r.$loaded(
        function(data) {
          // console.log(data); // true
        },
        function(error) {
          console.error("Error:", error);
        }
      );
      // var marksArr = $firebaseArray ( ob.$$conf.ref.child('marks') );
      
      // var rec = marksArr.$getRecord("carmel"); 
      // console.log(rec,marksArr);

      return;
      
      //  add mark to User Object
      UserService.addMarked(ob.$id);

      
      if(typeof ob.marked[Auth.$getAuth().uid] !== "undefined"){
        return false;
      }

      ob.marked[Auth.$getAuth().uid] = true;


      ob.$save().then(function(ref) {
        // ref.key === obj.$id; // true
        console.log(ref);
      }, function(error) {
        console.log("Error:", error);
      });
    }
  }   
  
  return actions;
});