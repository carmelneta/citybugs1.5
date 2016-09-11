(function(angular){  
  angular.module('cityBugs').component( 'obCard',{
    templateUrl: 'src/obs/ob-card/ob-card.component.html',
    bindings: {
      ob : '='
    },
    controller: function() {
      console.log(this);
       
    } 
  });
})(window.angular);