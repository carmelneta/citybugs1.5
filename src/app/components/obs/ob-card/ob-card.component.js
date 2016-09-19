class ObsCardController {
  constructor(ObsService, Auth, $timeout) {
    'ngInject'; 

    this._ObsService = ObsService;

    this.ownByCurrent = false; 

  }

  _setListners() {

    //  Listen for marked changes
    this._ObsService.isObMarkedByUser( this.ob.$id).then( results => {

      this.obMarkByUser = results.isMarkerd;

      this.unwatch = results.obj.$watch(x =>  {
        this._ObsService.isObMarkedByUser( this.ob.$id )
          .then(results => this.obMarkByUser = results.isMarkerd);
      });

    });

    this.ownByCurrent = this._ObsService.isObOwnByCurrent(this.ob);

  }

  //  Delete Ob
  delete(){
    console.log(this.ob);
    this._ObsService.delete(this.ob).then(
      () => this.onEmpty(),
      error => console.log(error)
    );
  }

  //  Mark Toggle 
  mark() {
    this._ObsService.mark(this.ob.$id);
  }

  $onInit(){

    //  Is the NOT ob loaded allready?
    if(!this.ob) {
      this.ob = this._ObsService.getOb( this.obId );
      this.ob.$loaded().then(x => {
        if(x.$value === null) { this.onEmpty(); }
      });
    }
    
    this._setListners();
  }

  $onDestroy() {
    if(this.unwatch) { this.unwatch() };
  }

}



export const ObsCardComponent = {
  templateUrl: 'app/components/obs/ob-card/ob-card.component.html',
  controller: ObsCardController,
  bindings: {
    onEmpty     : '&',
    obId        : '<',
    ob          : '<',
    moreActions : '<'
  }
}
 