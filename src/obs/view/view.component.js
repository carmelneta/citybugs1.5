(function(angular) {
  var ctrl = function( $mdToast){

    console.log(this);

    
    this.showSimpleToast = function() {

        var x =    $mdToast.simple()
          .textContent('Simple Toast!')
          .hideDelay(0)
          .action('Go!')
          .capsule(false)
          .highlightAction(true)
        
      // $mdToast.show( x ).then(x => console.log(x) );


      setTimeout(function(){
        // t.updateTextContent('ca');
        // console.log(x);
        // $mdToast.updateTextContent('ca');
        // x.hide();
        // $mdToast.hide(x)
      },1000)
    };


    
    this.$onInit = function(){
      this.showSimpleToast();
    }
    
  };


angular.module('cityBugs').component('obs.view.component', {
    bindings: { ob: '<' },
    templateUrl: 'src/obs/view/view.component.html',
    controller: ctrl
  }); 




})(window.angular);