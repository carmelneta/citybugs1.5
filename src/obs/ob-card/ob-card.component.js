(function(angular){  
  angular.module('cityBugs').component( 'obCard',{
    templateUrl: 'src/obs/ob-card/ob-card.component.html',
    bindings: {
      obId : '<',
      onClick: '&'
    },
    controller: function(obsService) {
      // console.log(this);
      var ctrl = this;

      ctrl.ob = obsService.getOb(ctrl.obId);
      //  Mark Toggle 
      ctrl.mark = function() {
        obsService.mark(ctrl.ob.$id);
      };
      return;
      // Listen for marks changes
      firebase.database().ref('obs/' + ctrl.ob.$id + '/marks')
      // this.ob.$$conf.ref.child('obs/' + ctrl.ob.$id + '/marks/')
      .on('value', function(snap) {
        // console.log(snap.val());
        console.log('Marks Change on: ', ctrl.ob.$id);
        obsService.isObMarkedByUser(ctrl.ob.$id).then(
          results => ctrl.obMarkByUser = results.isMarkerd
        );
      });
    } 
  });
})(window.angular);