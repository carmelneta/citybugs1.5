var myModule = angular.module('cityBugs')
.factory('obsService', function($firebaseObject, Auth, UserService, $firebaseArray, $q) {
  
  const actions = {

    getOb: function(obId) {
      var ref = firebase.database().ref().child('obs').child( obId );
      
      return $firebaseObject( ref );
    },
    
    mark: function (obId) {
      console.log('Marking: ', obId);
      
      
      var ref = firebase.database().ref()
        .child('obs/'+ obId +'/marks')

      
      var obj = $firebaseObject(ref);
      console.log(obj);
      if( obj[Auth.$getAuth().uid] ) {
        // obj  = null;
        // delete obj[Auth.$getAuth().uid];
        obj[Auth.$getAuth().uid] = null;
      }else {
         obj[Auth.$getAuth().uid]  = 'carmel';
      }
      obj.$save();
      return;

      obj.$loaded().then(function(data) {
        isMarked = typeof data[Auth.$getAuth().uid] !== 'undefined';
        
        console.log(data, isMarked);
        if(isMarked) {
          obj[Auth.$getAuth().uid] = null;
        }else {
          obj[Auth.$getAuth().uid] = 'carmel';
        }

        obj.$save();
      });

      return;

      this.isObMarkedByUser(obId).then( results => {
        console.log(results); 
        if(!results.isMarkerd) {
          //  Set mark on
          console.log("asd");
          results.obj[Auth.$getAuth().uid] = 'carmel';
          results.obj.$save();

          return;
          var marks = $firebaseArray(ref);
          marks.$add({ 
            username: 'carmel',
            uid:   Auth.$getAuth().uid
          });          

        }else {
          //  Set Mark Of
          results.obj.$remove();
        }
      }); 
    },

    isObMarkedByUser: function(obId) {
       console.log(obId);
      var deferred = $q.defer();

      var ref = firebase.database().ref()
        .child('obs/'+ obId +'/marks')
        .orderByChild('uid')
        .equalTo( Auth.$getAuth().uid )
        .limitToFirst(1);

      var obj = $firebaseObject(ref);
      obj.$loaded().then(data => deferred.resolve({
        isMarkerd: data.$value !== null,
        obj: obj
      }));
            
      return deferred.promise;
    }
  }   
  
  return actions;
});