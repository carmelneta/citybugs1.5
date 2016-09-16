(function(angular) {  
  var ctrl = function($scope) {
    var ctrl = this;
    var map;

    const initMap = function() {
      var markerOptions = {
            draggable: ctrl.draggable ? true : false,
            position: {lat: 32.7907379828099, lng: 34.99351501464844},
            animation: google.maps.Animation.DROP,
            title: 'Hello World!'
          },
          preventMarker = false;
        
      const initWithOb = function() {

        if(ctrl.ob.latitude && ctrl.ob.longitude) {
          markerOptions.position = {
            lat: ctrl.ob.latitude,
            lng: ctrl.ob.longitude
          }
        }else {
            preventMarker = true;
        }
      }

      const initWithMultiOb = function() {

      }
              
      if(ctrl.ob) { initWithOb(); }
      else if(ctrl.obs) { initWithMultiOb(); }

      
      var mapOptions = {
        center: markerOptions.position,
        zoom: 8
      };


      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      if(!preventMarker) {

        if(ctrl.ob) {
          var marker = new google.maps.Marker( Object.assign( {map}, markerOptions ) );
        
          marker.addListener('dragend', function() {
            $scope.$apply(function() {
                ctrl.onUpdate({
                  lat :  marker.getPosition().lat(),
                  lng :  marker.getPosition().lng()            
                });
              });
          });
        }else if(ctrl.obs) {
          ctrl.obs.$loaded().then( () => {
            var lt = new google.maps.LatLng(ctrl.obs[0].latitude, ctrl.obs[0].longitude);
            console.log(ctrl.obs[0].latitude);
            
            // map.setCenter(   );   
              // lat: ,
              // lng: ctrl.obs[i].longitude
            // });
            var markers = [];

            for(var i=0; i < ctrl.obs.length; i++) { 

              if(!ctrl.obs[i].latitude || !ctrl.obs[i].longitude) { continue; }

              markerOptions.position = {
                lat: ctrl.obs[i].latitude,
                lng: ctrl.obs[i].longitude
              }
              markerOptions.title = ctrl.obs[i].title;
              markers.push( new google.maps.Marker( Object.assign( {map}, markerOptions ) ) );
            }

            map.setCenter( markers[0].getPosition() );

          });
        }
      }

    }
    
    ctrl.$onInit = function() {
      initMap();      
    } 

  } 

  angular.module('cityBugs').component('obsMap', {
    bindings: {
      lat: '<',
      lng: '<',      
      ob: '<',
      obs: '<',
      draggable: '<',
      onUpdate: '&'
    },
    template: `
      <div id="map"></div>

      <style>
        #map {
          height: 300px;
          width: 100%;
        }
      </style>
    `,
    controller: ctrl
  }); 


})(window.angular);