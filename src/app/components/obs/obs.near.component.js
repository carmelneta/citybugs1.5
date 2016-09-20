class Ctrl {
  constructor( ObsService, $timeout, $firebaseObject, $q ) {
    'ngInject'; 

    this.ready = false; 
    this._ObsService = ObsService;
    this._$timeout = $timeout;
    this._$firebaseObject = $firebaseObject;
    this._$q = $q;
    this.obs = [];

  }

  query() {

    this.ready = false;

    var geofireObsRef = firebase.database().ref().child("_geofireObs");
    var obsRef = firebase.database().ref().child('obs');
    var geoFire = new GeoFire(geofireObsRef);

    var geoQuery = geoFire.query({
      center: [this.position.latitude, this.position.longitude],
      radius: this.radius
    });
    //  Ready
    geoQuery.on("ready", () => this._$timeout( () => this.ready = true ));

    //  Item Enter
    var onKeyEnteredRegistration = geoQuery.on("key_entered", (key, location, distance) => {
      //  console.log('Enter',key,location, distance);
      var obj = this._$firebaseObject(obsRef.child(key));
      obj.$loaded().then( (newOb) => {
        newOb.distance = distance;
        this._$timeout( () => this.obs.push(newOb) );
      });
    });

    var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location) {
      // log(key + " migrated out of the query. Bye bye :(");

    });

  }

  getPosition() {
    var deferred = this._$q.defer();
    
    if( navigator.geolocation ) {

      navigator.geolocation.getCurrentPosition( 
        pos => {                
          this._$timeout( () => {
            this.position = {
              latitude  : pos.coords.latitude,
              longitude : pos.coords.longitude
            }
            deferred.resolve();
          });
          
        },
        err => deferred.reject()

      );

    }else {
      deferred.reject();
    }

    return deferred.promise;    
    
  }

  $onInit() {
    
    this.radius = this.radius || 2;
    this.view = this.view || 'list';
    this.getPosition().then(
      () => this.query(),
      () => {
        this.ready = true;
        this.error = "Could not find you location";
      }
    )
  }
} 


export const ObsNearComponent = {
  controller: Ctrl,
  bindings: {
    'radius' : '<',
    'view'   : '<'
  },
  template : `
    <style>
      obs-near md-list-item p.distance{
        text-align: right;
        font-weight: bold;
      }
      obs-near md-list-item p{
        font-size: 13px;
      }
    </style>
      <md-card>
        <md-content layout-padding>
        <md-list> 

          <md-list-item>
            <p>Obs near you</p>      
            <md-button class="md-icon-button" aria-label="Swith View" ng-show="!$ctrl.error">      
              <md-icon ng-show="$ctrl.view !== 'map'"  ng-click="$ctrl.view = 'map'">map</md-icon>
              <md-icon ng-show="$ctrl.view !== 'list'" ng-click="$ctrl.view = 'list'">list</md-icon>
            </md-button>      
          </md-list-item>

          <md-list-item ng-if="!$ctrl.ready">
            <p>Searching</p>            
            <md-progress-circular md-mode="indeterminate"></md-progress-circular>
          </md-list-item>
          
          <md-list-item ng-if="$ctrl.ready && !$ctrl.obs.length && !$ctrl.error">
            <p>None! Your city is good :)</p>            
            <md-icon>done_all</md-icon>
          </md-list-item>
          
          <md-list-item ng-if="$ctrl.error">
            <md-icon>my_location</md-icon>
            <p>{{$ctrl.error}}</p>            
          </md-list-item>

          <md-list-item ng-if="$ctrl.view ==='list'" ng-repeat="ob in $ctrl.obs" ui-sref="main.obs.view({obId: ob.$id})">
            <ob-image ob="ob" img-class="'md-avatar'"></ob-image>
            <p>{{ ob.title }}</p>

            <p class="distance">{{ob.distance| number:0}}Km</p>
            
            <md-divider></md-divider>
          </md-list-item>

        </md-list>            

        <obs-map ng-if="$ctrl.view === 'map' && $ctrl.ready" obs-array="$ctrl.obs"></obs-map>

      </md-card>
  `,
}
