class AddObCtrl {
  
  constructor($firebaseObject, $firebaseArray, Auth, $timeout, $mdToast, ObsService, $mdBottomSheet, $state, $q) {
    'ngInject'; 
       
    this._Auth = Auth;
    this._$firebaseObject = $firebaseObject;
    this._$firebaseArray = $firebaseArray;
    this._ObsService = ObsService;
    this._$timeout = $timeout;
    this._$mdBottomSheet = $mdBottomSheet;
    this._$mdToast = $mdToast;
    this._$q = $q;
    

    this.images = [];
    this.obObj = {};

    this.deviceHasGeo = false;
    this.manualPosition = false;
  }
  
 
    _uploadFiles() {
      
      console.log('Uploading', this.images);
      var deferred = this._$q.defer();

      if(!this.images.length) { 
        deferred.resolve();        
        return deferred.promise; 
      }

      this.loadingParcent = 0;

      this._$mdToast.show({
        hideDelay   : false,
        position    : 'bottom left',
        template    : `
          <md-toast>
            <span class="md-toast-text" flex>Loading Images</span> 
          </md-toast>
        `
      });

      var imgCount = this.images.length,
          finished = [],
          imgRef = this.obObj.$ref().child('images'),
          list = this._$firebaseArray(imgRef);
      

      var imgsObj = {
        count: this.images.length,
        done: [],
        testFinished: () => {
          if(imgsObj.done.length === imgsObj.count) {
            this._$mdToast.hide();            
            deferred.resolve();
          }
        },
        onDone: function() {
          console.log('One Done',  this.snapshot );
          list.$add( this.snapshot.downloadURL );
          imgsObj.done.push(true);
          imgsObj.testFinished();
          
        }
      };

      var storageRef = firebase.storage().ref();

      // Create a reference to 'mountains.jpg'
      var fielsRef = storageRef
        .child('images')
        .child( this._Auth.$getAuth().uid )
        .child( this.obObj.$id );

        // console.log(images);
      for(var i=0; i < imgCount; i++) {
        
        //  console.log(images[i]);

        var task = fielsRef
          .child( this.obObj.$id + '____' + i )
          .put(   this.images[i]);

        task.on('state_changed', 
        
          snapshot => {
          
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log('Upload is ' + progress + '% done');        
            // $timeout( () => ctrl.loadingParcent = Math.floor(progress) ); 

          }, 
          // Handle unsuccessful uploads
          error => { 

            imgsObj.done.push(false);
            imgsObj.testFinished();

          }, 
          imgsObj.onDone.bind(task)
        );
      }

      return deferred.promise;
    }

     _setPosition(force) {
      
      const self = this;
      
      if(force) { return false; }

      if( navigator.geolocation ) {
        this.deviceHasGeo = true;

        navigator.geolocation.getCurrentPosition( 
          pos => {            
            // console.log(pos, ctrl);
            this._$timeout( () => {
              this.ob.latitude = pos.coords.latitude;
              this.ob.longitude = pos.coords.longitude;              
              this.manualPosition = false;
            });
          },
          err => {
            //  console.log(err);                
            this._$timeout( () => {
              this.manualPosition = true;
              this._showSimpleToast('Position is blocked');
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
    }
    
     _reset() {
      console.log('Restting');
      this.obId = null;
      this.$onInit();
    }

    _doneModal() {
       
      this._$mdBottomSheet.show({
        controllerAs: 'mo',
        controller: $mdBottomSheet => {
          'ngInject'; 
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
        if(action === 'add') { this._reset() }
        else if(action === 'view') { $state.go('obs.view', {obId: this.obObj.$id}); }
        else if(action === 'home') { $state.go('home') }
      }); 

    }
    
    _showSimpleToast(text) {
      if(!text) { return; } 
      this._$mdToast.show(
        this._$mdToast.simple()
          .position('top')
          .textContent(text)
          .hideDelay(3000)
      );
    }
     
    submit() {
      
      this.obObj.$value = this.ob;
      this.obObj.$save().then( 
        ref => this._uploadFiles().then( () =>  this._doneModal() ),        
        error => _showSimpleToast('Error Saving Ob')
      );


    }

    $onInit() {
      // console.log('Iniit', this);
      
      this.ob = {
        uid: this._Auth.$getAuth().uid
      };

      //  Are we editing?
      if(this.obId) {

        this.obObj = this._ObsService.getOb( this.obId );
        this.obObj.$loaded().then( x => this.ob = x );

      }else {        
        var ref = firebase.database().ref('obs').push();        
        this.obObj = this._$firebaseObject(ref); 
      }

      this._setPosition();       
    }

    markerChange(lat, lng) {      
      this.ob.latitude = lat;
      this.ob.longitude = lng;
    }

    imageChange(files) {
      this.images = files;
    }

    delExsistImg(index) {
      
      var imagesRef = this.ob.$$conf.ref.child('images');
      var imagesArr = this._$firebaseArray( imagesRef );
      imagesArr.$loaded().then( () => imagesArr.$remove( imagesArr[index] ) );

    }

    posTypeChange() {      
      this._setPosition( this.manualPosition );
    }

  }


export const AddObComponent = {
  templateUrl: 'app/components/obs/add.component/add.component.html',
  controller: AddObCtrl
}

export const EditObComponent = {
  templateUrl: 'app/components/obs/add.component/add.component.html',
  controller: AddObCtrl,
  bindings: { obId: '<' }
}
 