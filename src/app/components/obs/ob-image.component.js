export const ObImageClass = {
  template: '<img ng-src="{{$ctrl.imgSrc}}" class="ob-image">',
  bindings: {
    ob : '<'
  },
  controller: function() {
    
    if(this.ob.images){
      this.imgSrc = this.ob.images[ Object.keys( this.ob.images )[0] ];      
    }else {
      this.imgSrc =  "https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=200";
    }
  } 
}