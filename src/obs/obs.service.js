(function(angular){
  var myModule = angular.module('cityBugs')
  .factory('obsService', function($firebaseObject, Auth, UserService, $firebaseArray, $q) {
    
    const actions = {

      getOb: function(obId) {
        var ref = firebase.database().ref().child('obs').child( obId );
        
        return $firebaseObject( ref );
      },
      
      mark: function (obId) {
        // console.log('Marking: ', obId);
        var user = Auth.$getAuth();

        this.isObMarkedByUser(obId).then(function(results) {
          //console.log(results);

          if(results.isMarkerd) {
            //  Remove Mark
            results.obj.$remove();
            UserService.removeMark(obId);
          }else {          
            //  Add Mark 
            results.obj[Auth.$getAuth().uid] = {username: user.displayName ? user.displayName : user.email};
            UserService.addMark(obId);
          }

          results.obj.$save();
        });
    
      },

      isObMarkedByUser: function(obId) { 
        // console.log('Checking if marked: ', obId, Auth.$getAuth());
        
        var deferred = $q.defer();
        var auth = Auth.$getAuth();
        if(!auth) {
          deferred.reject();
          return deferred.promise;
        }
        var ref = firebase.database().ref()
          .child('obs/'+ obId +'/marks')
          .orderByKey()
          .equalTo( Auth.$getAuth().uid )
          .limitToFirst(1);

        var obj = $firebaseObject(ref);

        obj.$loaded().then(data => deferred.resolve({
          isMarkerd: data.$value !== null,
          obj: obj
        }));
              
        return deferred.promise;
      },

      isObOwnByCurrent: ob => {
        var auth = Auth.$getAuth();
        return auth && auth.uid === ob.uid;
      }
    }   
    
    return actions;
  });
})(window.angular);