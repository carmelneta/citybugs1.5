(function(angular) {
  var ctrl = function($firebaseObject){
    
    var ctrl = this;

    this.ob = {};
    this.deviceHasGeo = false;
    this.manualPosition = false;
  
    function _setPosition() {
      
      const self = this;

      if( navigator.geolocation ) {
        this.deviceHasGeo = true;

        navigator.geolocation.getCurrentPosition( 
          pos => {            
            // console.log(pos, ctrl);
            ctrl.ob.latitude = pos.coords.latitude;
            ctrl.ob.longitude = pos.coords.longitude;              
            ctrl.manualPosition = false;
          },
          err => {
            console.log(err);    
            ctrl.manualPosition = true;        
            ctrl.markerDragEnd();
          }

        );

      }else {
        console.log('no geolocation');
        this.markerDragEnd();
        ctrl.manualPosition = true;
      }
    };

    
    this.markerDragEnd = function(e) {
      console.log('Setting position by marker', e, this);

      return false;

      if(e) { 
        this.ob.latitude = e.detail.latLng.lat();
        this.ob.longitude = e.detail.latLng.lng();
      }else {
        this.ob.latitude = this.$.marker.latitude;
        this.ob.longitude = this.$.marker.longitude;
      }
      
    };
    this.imageLoad = function(e){
      console.log(e);
      
    }
    this.submit = function() {
      console.log(this.images);

      return;
      
      var ref = firebase.database().ref('obs').push();
      
      var obj = $firebaseObject(ref);

      
      obj.$value = this.ob;
      obj.$save();
      
    }

    this.$onInit = function(){
      _setPosition();       
    }
  };


  angular.module('cityBugs').component('obs.add.component', {
    templateUrl: 'src/obs/add/add.component.html',
    controller: ctrl
  }); 




})(window.angular);