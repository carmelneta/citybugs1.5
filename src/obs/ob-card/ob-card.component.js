(function(angular){  
  angular.module('cityBugs').component( 'obCard',{
    templateUrl: 'src/obs/ob-card/ob-card.component.html',
    bindings: {
      ob : '=',
      onClick: '&'
    },
    controller: function(obsService) {
      // console.log(this);
      var ctrl = this;

      ctrl.bookmark = function() {
        // alert("asd");
        obsService.mark(ctrl.ob);
      }
    } 
  });
})(window.angular);