(function(angular) {
  
  var ctrl = function($firebaseObject, $firebaseArray, Auth, $timeout, $mdToast, obsService, $mdBottomSheet, $state, $q) {
    var ctrl = this,
        images = [],
        obObj = {}
      ;

    
    this.deviceHasGeo = false;
    this.manualPosition = false;
 
    function _uploadFiles() {
      
      // console.log('Uploading', images);
      var deferred = $q.defer();

      if(!images.length) { 
        deferred.resolve();        
        return deferred.promise; 
      }

      ctrl.loadingParcent = 0;

      $mdToast.show({
        hideDelay   : false,
        position    : 'bottom left',
        template    : `
          <md-toast>
            <span class="md-toast-text" flex>Loading Images</span> 
          </md-toast>
        `
      });

      var imgCount = images.length,
          finished = [];
      var imgRef = obObj.$ref().child('images'),
          list = $firebaseArray(imgRef);
      

      var imgsObj = {
        count: images.length,
        done: [],
        testFinished: () => {
          if(imgsObj.done.length === imgsObj.count) {
            $mdToast.hide();
            
            deferred.resolve();
          }
        },
        onDone: function() {
          //console.log('One Done', this.snapshot.downloadURL);
          list.$add(this.snapshot.downloadURL);
          imgsObj.done.push(true);
          imgsObj.testFinished();
          
        }
      };

      var storageRef = firebase.storage().ref();

      // Create a reference to 'mountains.jpg'
      var fielsRef = storageRef
        .child('images')
        .child( Auth.$getAuth().uid )
        .child( obObj.$id );

        // console.log(images);
      for(var i=0; i < imgCount; i++) {
        
        //  console.log(images[i]);

        var task = fielsRef.child( obObj.$id + '____' + i )
            .put(images[i]);

        task.on('state_changed', 
        
        function(snapshot) {
          
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //  console.log('Upload is ' + progress + '% done');
        
          $timeout( () => ctrl.loadingParcent = Math.floor(progress) ); 

        }, function(error) { // Handle unsuccessful uploads

          imgsObj.done.push(false);
          imgsObj.testFinished();

        }, imgsObj.onDone.bind(task)
        );
      }


      
      return deferred.promise;
    };

    function _setPosition(force) {
      
      const self = this;
      
      if(force) { return false; }

      if( navigator.geolocation ) {
        this.deviceHasGeo = true;

        navigator.geolocation.getCurrentPosition( 
          pos => {            
            // console.log(pos, ctrl);
            $timeout( () => {
              ctrl.ob.latitude = pos.coords.latitude;
              ctrl.ob.longitude = pos.coords.longitude;              
              ctrl.manualPosition = false;
            });
          },
          err => {
            //  console.log(err);                
            $timeout( () => {
              ctrl.manualPosition = true;
              _showSimpleToast('Position is blocked');
            });
          }

        );

      }else {
        // console.log('no geolocation');
        $timeout( () => {
          ctrl.manualPosition = true;
          __showSimpleToast('Device has no geolocation');
        });
      }
    };
    
    function _reset() {
      console.log('Restting');
      ctrl.obId = null;
      ctrl.$onInit();
    }

    function _doneModal() {
       
      $mdBottomSheet.show({
        controllerAs: 'mo',
        controller: function( $mdBottomSheet ) {
          this.click = action => $mdBottomSheet.hide(action);
        },
        template: `
          <md-bottom-sheet class="md-grid" layout="column">
          <div layout="row" layout-align="center center" ng-cloak>
            <h4>Loading Done! What next?</h4>
          </div>
          <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>
            
            <md-button class="md-fab" aria-label="Add More" ng-click="mo.click('add')">
                <md-icon>add</md-icon>
            </md-button>

            <md-button class="md-fab" ng-click="mo.click('view')">
                <md-icon>forward</md-icon>
            </md-button>

            <md-button class="md-fab" ng-click="mo.click('home')">
                <md-icon>home</md-icon>
            </md-button>

          </section>
        </md-bottom-sheet>
        `
      })
      .then(function(action){
        if(action === 'add') { _reset() }
        else if(action === 'view') { $state.go('obs.view', {obId: obObj.$id}); }
        else if(action === 'home') { $state.go('home') }
      }); 

    }
    
    _showSimpleToast = function(text) {
      if(!text) { return; } 
      $mdToast.show(
        $mdToast.simple()
          .position('top')
          .textContent(text)
          .hideDelay(3000)
      );
    };
     
    this.submit = function() {
      
      obObj.$value = ctrl.ob;

      obObj.$save().then(function(ref) {
        
        //if( images.length ) { (); }
        _uploadFiles().then( () =>  _doneModal() );
        
      }, function(error) {
        _showSimpleToast('Error Saving Ob');
      });


    }

    this.$onInit = function() {
      //console.log('Iniit');
      
      ctrl.ob = {
        uid: Auth.$getAuth().uid
      };

      //  Are we editing?
      if(ctrl.obId) {

        obObj = obsService.getOb(ctrl.obId);
        obObj.$loaded().then(x => {
          ctrl.ob = x;
        });

      }else {        
        var ref = firebase.database().ref('obs').push();        
        obObj = $firebaseObject(ref); 
      }

      _setPosition();       
    }

    this.markerChange = (lat, lng) => {      
      this.ob.latitude = lat;
      this.ob.longitude = lng;
    }

    this.imageChange = files => images = files;

    this.delExsistImg = function(index) {
      
      var imagesRef = ctrl.ob.$$conf.ref.child('images');
      var imagesArr = $firebaseArray( imagesRef );
      imagesArr.$loaded().then( () => imagesArr.$remove( imagesArr[index] ) );

    }

    ctrl.posTypeChange = function() {      
      _setPosition( ctrl.manualPosition );
    }

  };


  angular.module('cityBugs').component('obs.add.component', {
    templateUrl: 'src/obs/add/add.component.html',
    controller: ctrl
  }); 

  angular.module('cityBugs').component('obs.edit.component', {
    bindings: {
      'obId' : '='
    },
    templateUrl: 'src/obs/add/add.component.html',
    controller: ctrl
  }); 


})(window.angular);