(function(angular){  
  angular.module('cityBugs').component( 'obImage',{
    template: '<img ng-src="{{$ctrl.imgSrc}}" class="ob-image">',
    bindings: {
      ob : '<'
    },
    controller: function() {
        // console.log( 'Calc Image',this.ob);
        if(this.ob.images && this.ob.images[0]) {
          this.imgSrc = this.ob.images[0].url;
        }

        var randHeight =  Math.floor(Math.random() * (500 - 100 + 1) + 100);
        this.imgSrc =  "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=" + randHeight;
      
    } 
  });
})(window.angular);