(function(angular){

  var ctrl = function(obsService, Auth, $timeout) {
    // console.log(this);
    var ctrl = this;
    var utils = {
      setListners: function() {

        //  Listen for marked changes
        obsService.isObMarkedByUser(ctrl.ob.$id).then( results => {

          ctrl.obMarkByUser = results.isMarkerd;

          utils.unwatch = results.obj.$watch(x =>  {
            obsService.isObMarkedByUser(ctrl.ob.$id).then(results => ctrl.obMarkByUser = results.isMarkerd);
          });

        });

        ctrl.ownByCurrent = obsService.isObOwnByCurrent(ctrl.ob);

      }
    };

    ctrl.ownByCurrent = false;   

    //  Mark Toggle 
    ctrl.mark = () => obsService.mark(ctrl.ob.$id);
    

    ctrl.$onDestroy = function(){
      if(utils.unwatch) { utils.unwatch() };
    }

    ctrl.$onInit = function() {
      // console.log('Initing', ctrl.ob);

      //  Is the NOT ob loaded allready?
      if(!ctrl.ob) {
        ctrl.ob = obsService.getOb(ctrl.obId);
        ctrl.ob.$loaded().then(x => {
          if(x.$value === null) { $timeout( () => ctrl.onEmpty() ); }
          utils.setListners();
        });
      }else {
        utils.setListners();
      }
    }

  }

  angular.module('cityBugs').component( 'obCard',{
    templateUrl: 'src/obs/ob-card/ob-card.component.html',
    bindings: {
      onEmpty     : '&',
      obId        : '<',
      ob          : '<',
      moreActions : '<'
    },
    controller: ctrl
  });
})(window.angular);