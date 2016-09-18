class ProfileCtrl {
  constructor($mdBottomSheet, $firebaseArray, Auth) {
    'ngInject'; 

    this._$mdBottomSheet = $mdBottomSheet;
    this._$firebaseArray = $firebaseArray;
    this._Auth = Auth;
    
  }

  $onInit() { 
    console.log("User PRofile");
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

      <md-content class="md-padding" layout="row" layout-wrap> 
        <h1>Hey</h1>
      </md-content>
    `
}