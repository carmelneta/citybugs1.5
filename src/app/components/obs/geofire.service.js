export class GeoFireService {
  constructor($q) {
    'ngInject'; 
  }

  delete(obId) {
    
    var geofireObsRef = firebase.database().ref().child("_geofireObs");
    var geoFire = new GeoFire(geofireObsRef);

    return geoFire.remove( obId );
  }

  add() {

  }
}