class ObMapCtrl {
  constructor($scope) {
    'ngInject'; 
    // this.ob = {};

    this._$scope = $scope;

  }
  initMap() {
    // let self = this; 
    let map;
    var preventMarker = false;
    var markerOptions = {
          draggable: this.draggable ? true : false,
          position: {lat: 32.7907379828099, lng: 34.99351501464844},
          animation: google.maps.Animation.DROP,
          title: 'Hello World!'
        },
        preventMarker = false;

    const initWithOb = () => {

      if(this.ob.hasOwnProperty('latitude') && this.ob.hasOwnProperty('longitude')) {
        markerOptions.position = {
          lat: this.ob.latitude,
          lng: this.ob.longitude
        }
      }
      
    };

    const initWithMultiOb = () => {};
    
    const addMarker = () => {

      var markers = [];
      for(var i=0; i < this.obs.length; i++) { 
        if(!this.obs[i].latitude || !this.obs[i].longitude) { continue; }

        markerOptions.position = {
          lat: this.obs[i].latitude,
          lng: this.obs[i].longitude
        }
        markerOptions.title = this.obs[i].title;
        markers.push( new google.maps.Marker( Object.assign( {map}, markerOptions ) ));
      }

      if(markers[0]) {
        map.setCenter( markers[0].getPosition() );
      }

    }

    if(this.ob) { initWithOb(); }
    else if(this.obs) { initWithMultiOb(); }

    
    var mapOptions = {
      center: markerOptions.position,
      zoom: 8
    };


    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if(!preventMarker) {
      if(this.ob) {
        var marker = new google.maps.Marker( Object.assign( {map}, markerOptions ) );
      
        marker.addListener('dragend', () => {
          this._$scope.$apply( () => {
              this.onUpdate({
                lat :  marker.getPosition().lat(),
                lng :  marker.getPosition().lng()            
              });
            });
        });

      }else if(this.obs) {
        this.obs.$loaded().then( () => addMarker());
      }else if(this.obsArray) {
        this.obs = this.obsArray;
        addMarker();
      }
    }

  }

  $onInit() {
    this.initMap();
  }
}
export const ObsMapComponent = {
  
  controller: ObMapCtrl,
  bindings: {
    lat: '<',
    lng: '<',      
    ob: '<',
    obs: '<',
    obsArray: '<',  //  Array obs FirebaseObject, loaded
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
  `
}