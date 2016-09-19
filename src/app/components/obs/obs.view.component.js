class ObsViewCtrl {
  constructor($mdBottomSheet, ObsService, $timeout) {
    'ngInject'; 

    this.ready = false; 
    this._ObsService = ObsService;

    this.$timeout = $timeout;
    this.$mdBottomSheet = $mdBottomSheet;
  } 

  _openBottomSheet() {
    this.$mdBottomSheet.show({
      
      template: `
        <md-bottom-sheet class="md-grid" layout="column">
        <div layout="row" layout-align="center center" ng-cloak>
          <h4>Errr, No results found...</h4>
        </div>
        <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>
          <a ui-sref="main.obs.add">
            <md-button class="md-fab" aria-label="Eat cake">
                <md-icon>add</md-icon>
            </md-button>
          </a>

          <a ui-sref="main.home">
            <md-button class="md-fab" aria-label="Eat cake">
                <md-icon>home</md-icon>
            </md-button>
          </a>

        </section>
      </md-bottom-sheet>
      `
    });
  }

  $onInit() {
    
    this.ob = this._ObsService.getOb(this.obId);

    this.ob.$loaded().then(x => {      
      this.ready = true;
      if(x.$value === null) { 
        this.$timeout( () => this._openBottomSheet() ); 
      }
    });
  }

  empty() {
    this._openBottomSheet();
  }

  $onDestroy() {
    this.ob.$destroy();
  };
}

export const ObsViewComponent = {
  template : `
     <div ng-if="$ctrl.ready">
        <ob-card ob="$ctrl.ob" more-actions="true" on-empty="$ctrl.empty()"></ob-card>
        <obs-map ob="$ctrl.ob"></obs-map>
        <ob-comments ob-id="$ctrl.obId"></ob-comments>
      </div>

      <div ng-show="!$ctrl.ready">Loading</div>
  `,
  controller: ObsViewCtrl,
  bindings: { obId: '<' },
}
 