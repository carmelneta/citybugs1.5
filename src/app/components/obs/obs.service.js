export class ObsServiceClass {
  constructor($firebaseObject, Auth, UserService, $firebaseArray, $q) {
    'ngInject'; 
    this._$q = $q;
    this._$firebaseObject = $firebaseObject;
    this._Auth = Auth;
    this._UserService = UserService;
  }
  
  getOb(obId) {
    var ref = firebase.database().ref().child('obs').child( obId ); 
    return this._$firebaseObject( ref );
  }

  
  mark(obId) {
    // console.log('Marking: ', obId);
    var user = this._Auth.$getAuth();

    this.isObMarkedByUser(obId).then(results => {
      //console.log(results);

      if(results.isMarkerd) {
        //  Remove Mark
        results.obj.$remove();
        this._UserService.removeMark(obId);
      }else {          
        //  Add Mark 
        results.obj[this._Auth.$getAuth().uid] = {username: user.displayName ? user.displayName : user.email};
        this._UserService.addMark(obId);
      }

      results.obj.$save();
    });

  }

  isObMarkedByUser(obId) { 
    // console.log('Checking if marked: ', obId, Auth.$getAuth());
    
    var deferred = this._$q.defer();
    var auth = this._Auth.$getAuth();
    if(!auth) {
      deferred.reject();
      return deferred.promise;
    }
    var ref = firebase.database().ref()
      .child('obs/'+ obId +'/marks')
      .orderByKey()
      .equalTo( this._Auth.$getAuth().uid )
      .limitToFirst(1);

    var obj = this._$firebaseObject(ref);

    obj.$loaded().then(data => deferred.resolve({
      isMarkerd: data.$value !== null,
      obj: obj
    }));
          
    return deferred.promise;
  }

  isObOwnByCurrent(ob) {
    var auth = this._Auth.$getAuth();
    return auth && auth.uid === ob.uid;
  }
}