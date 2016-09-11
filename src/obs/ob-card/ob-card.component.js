(function(angular){  
  angular.module('cityBugs').component( 'obCard',{
    templateUrl: 'src/obs/ob-card/ob-card.component.html',
    bindings: {
      ob : '=',
      onClick: '&'
    },
    controller: function() {
      console.log(this);
       
      this.cardClick = function() {
        // alert("asd");
        console.log(this.onClick());
      }
    } 
  });
})(window.angular);