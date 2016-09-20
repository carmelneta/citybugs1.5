class Ctrl {

  constructor($firebaseArray, ArrayWithSumFactory, Auth){
    'ngInject'; 
    this._$firebaseArray = $firebaseArray;
    this._ArrayWithSumFactory = ArrayWithSumFactory;
    this._Auth = Auth;
  }

  addNew() {
    if(this.commentForm.$invalid || !this.auth) {
      return false;
    }

    
    this.comments.$add({ 
      content: this.newComment,
      uid: auth.uid,
      created: firebase.database.ServerValue.TIMESTAMP
    });
  }

  $onInit() {
    var t = this.ob.$$conf.ref.child('comments').orderByChild('created');
    this.comments = new this._ArrayWithSumFactory( t );   
    
    this.auth = this._Auth.$getAuth();     
  }

}

export const ObsCommentsComponent = {
  controller: Ctrl,
  bindings: {
    ob : '<'
  },
  template: ` 
    <md-list flex>
      <md-subheader class="md-no-sticky">{{$ctrl.comments.length}} Commets</md-subheader>

      <md-list-item class="" ng-repeat="comment in $ctrl.comments">
        <img ng-src="{{comment.user.photoURL}}" class="md-avatar"/>
        <div class="md-list-item-text">
          <h5 style="margin-bottom:0;">{{ comment.user.displayName }}</h5>
          <p style="margin-top: 0;">{{comment.content}}</p>
        </div>
      <md-divider ></md-divider>
      </md-list-item>

      <md-list-item ng-if="$ctrl.auth">        
        <form name="$ctrl.commentForm" ng-submit="$ctrl.addNew()" novalidate>        
          <md-input-container class="md-block">
            <label>Add New Commet</label>
            <md-icon ng-click="$ctrl.addNew()">add</md-icon>
            <input required md-no-asterisk name="$ctrl.commentForm.newComment" ng-model="$ctrl.newComment">
            <div ng-messages="$ctrl.commentForm.newComment.$error">
              <div ng-message="required">No comment content.</div>
            </div>
          </md-input-container>
        </form>
      </md-list-item>
    </md-list>
  `
}

export function ArrayWithSum($firebaseArray, $timeout) {
  'ngInject'; 
  return $firebaseArray.$extend({
     $$added: snapshot => {
      var data = snapshot.val();
      data.$id = snapshot.key;
      if(data.uid) {
       firebase.database().ref('users').child( data.uid )
        .on('value', function(snapshot) {
          var val = snapshot.val();       
          if(val) {            
            $timeout( () => {
              data.user = {
                displayName: val.displayName,
                photoURL: val.photoURL
              };
            });
          }
        });
      }
      return data;

    }
  });
}
 