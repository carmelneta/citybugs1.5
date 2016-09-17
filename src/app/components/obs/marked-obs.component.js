class MarkObsCtrl {
  constructor($mdBottomSheet, $firebaseArray, Auth) {
    'ngInject'; 

    this._$mdBottomSheet = $mdBottomSheet;
    this._$firebaseArray = $firebaseArray;
    this._Auth = Auth;
    
    this.empty = $index => this.obs.$remove( this.obs[$index] );
  }

  $onInit() {
    let ref = firebase.database().ref()
      .child('users')
      .child( this._Auth.$getAuth().uid )
      .child('marks')   
      .limitToLast(50);    

    this.obs = this._$firebaseArray(ref);   
    
    this.obs.$loaded().then( data => { 
      if(!data.length) { this.openBottomSheet(); };
    });

    
    this.obs.$watch( event => {
      if(!this.obs.length) { this.openBottomSheet(); }
    });
    
  }
  openBottomSheet() {
    this._$mdBottomSheet.show({
      
      template: `
        <md-bottom-sheet class="md-grid" layout="column">
        <div layout="row" layout-align="center center" ng-cloak>
          <h4>Errr, No results found...</h4>
        </div>
        <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>
          <a ui-sref="obs.add">
            <md-button class="md-fab" aria-label="Eat cake">
                <md-icon>add</md-icon>
            </md-button>
          </a>

          <a ui-sref="home">
            <md-button class="md-fab" aria-label="Eat cake">
                <md-icon>home</md-icon>
            </md-button>
          </a>

        </section>
      </md-bottom-sheet>
      `
    });
  }

  $onDestroy() {
    this.obs.$destroy();
  }
}

export const MarkObsComponent = {
  controller: MarkObsCtrl,
  template: `
      <md-toolbar class="md-warn">
        <div class="md-toolbar-tools">
          <h2 class="md-flex">Marked Observations</h2>
        </div>
      </md-toolbar>

      <md-content class="md-padding" layout="row" layout-wrap> 
        <ob-card flex="50" ng-repeat="ob in $ctrl.obs" ob-id="ob.$id" on-empty="$ctrl.empty($index)"></ob-card>
      </md-content>
    `
}