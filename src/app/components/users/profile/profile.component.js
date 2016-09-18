class ProfileCtrl {
  constructor(Auth, $mdToast, $q) {
    'ngInject'; 

    this._Auth = Auth;
    this._$mdToast = $mdToast;
    this._$q = $q;

    this.fileChangeFlag = false;
  }

  _uploadFiles(file) {
      
    var deferred = this._$q.defer();

    if(!file) { 
      deferred.reject('No File');        
      return deferred.promise; 
    }


    this._$mdToast.show({
      hideDelay   : false,
      position    : 'bottom left',
      template    : `
        <md-toast>
          <span class="md-toast-text" flex>Loading Images</span> 
        </md-toast>
      `
    }); 

    var storageRef = firebase.storage().ref();

    // Create a reference to File
    var fielsRef = storageRef
      .child('images')
      .child( this._Auth.$getAuth().uid )
      .child( 'profile' );

      
    var task = fielsRef
      .child( 'profileImg' )
      .put( file[0] );
      
    task.on('state_changed',
      //  progress
      snapshot => {      
        // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');        
      }, 
      // Handle unsuccessful uploads
      error => {}, 
      //  Done
      () => {
        // console.log(task, this);
        deferred.resolve(task.snapshot.downloadURL);
        this._$mdToast.hide();
           
      }
    );
    return deferred.promise;
  }

  imageChange(file) {
    this.file = file; 
    this.fileChangeFlag = true;
  }

  submit() {

    const send = (imgUrl) => {
      var profile = {
        displayName : this.user.displayName
      }

      if(this.fileChangeFlag && imgUrl) { profile.photoURL = imgUrl; }

      this._Auth.$getAuth().updateProfile(profile);

      // console.log('Saveing Email', !this.form.email.$pristine);
      if( !this.form.email.$pristine ) {
        this._Auth.$updateEmail( this.user.email ).then(
          null,
          error => {
            console.log(error);
            var msgs = {
              'auth/requires-recent-login': 'Log in again before retrying this request.'
            }            
            this._$mdToast.show({
              hideDelay   : 3000,
              position    : 'bottom left',
              template    : `
                <md-toast>
                  <span class="md-toast-text" flex>${msgs[error.code]}</span> 
                </md-toast>
              `
            })
          }
        );
      }

      // console.log('Saveing Password', !this.form.password.$pristine);
      if( !this.form.password.$pristine ) {
         this._Auth.$updatePassword( this.user.password ).then(
          null,
          error => {
            // console.log(error);
            var msgs = {
              'auth/requires-recent-login': 'Log in again before retrying this request.'
            }            
            this._$mdToast.show({
              hideDelay   : 3000,
              position    : 'bottom left',
              template    : `
                <md-toast>
                  <span class="md-toast-text" flex>${msgs[error.code]}</span> 
                </md-toast>
              `
            })
          }
        );
      } 
    }

    if(this.fileChangeFlag) {    
      this._uploadFiles( this.file ).then(
        //  Success
        send,
        //  Failure 
        error => {}
      );
    }else {
      send(false);
    }
  }

  $onInit() { 
    var auth = this._Auth.$getAuth();
    this.user ={
      displayName: auth.displayName,
      photoURL: [auth.photoURL],
      email: auth.email,
      password: ''
    };

  } 

  $onDestroy() { 
  }
}

export const UserProfileComponent = {
  controller: ProfileCtrl,
  template: `
      <md-toolbar class="md-warn">
        <div class="md-toolbar-tools">
          <h2 class="md-flex">User Profile</h2>
        </div>
      </md-toolbar>

      <md-content class="md-padding" layout="column">
        
        <form novalidate ng-submit="$ctrl.submit()" name="$ctrl.form" >    

          <md-card>    
            <md-card-content>
              <md-input-container>
                <label>Display Name</label>
                <input ng-model="$ctrl.user.displayName" required>
              </md-input-container>

              <md-input-container>
                <label>Email</label>
                <input ng-model="$ctrl.user.email" name="email" required>
              </md-input-container>

              <md-input-container>
                <label>Password</label>
                <input ng-model="$ctrl.user.password" type="password" name="password">
                 <small class="hint">To be used only for password changing</small>
              </md-input-container>

            </md-card-content>
          </md-card>
              
          <file-upload 
            label="'Profile Image'"
            btntext="'choose'"
            on-change="$ctrl.imageChange(files)" 
            on-del-exsist="$ctrl.delExsistImg(index)" 
            init-images="$ctrl.user.photoURL">
          </file-upload>

          <div layout="row" layout-align="end">
            <md-button class="md-primary md-raised" type="submit">Submit</md-button>
          </div>

        </form>
        
      </md-content>
      <pre>{{form | json}}</pre> 
    `
}