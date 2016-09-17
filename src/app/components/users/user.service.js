export function Auth( $firebaseAuth ) {
  'ngInject'; 
  return $firebaseAuth()
}

export class UserServiceClass {
  constructor ( Auth, $firebaseObject, $firebaseArray ) {
    'ngInject';    
    this._Auth = Auth;
    this._$firebaseObject = $firebaseObject;
    this._$firebaseArray = $firebaseArray;

  }  

  addMark(obId) {
    var ref = firebase.database().ref()
      .child('users')
      .child( this._Auth.$getAuth().uid )
      .child('marks')      
      .child(obId);
    ;      
    
    var obj = this._$firebaseObject(ref); 
    obj.added = firebase.database.ServerValue.TIMESTAMP;
    obj.$save();
  }

  removeMark(obId) {
    var ref = firebase.database().ref()
      .child('users')
      .child( this._Auth.$getAuth().uid )
      .child('marks')      
      .child(obId);
    ;      
    
    this._$firebaseObject(ref).$remove();      
  }
}