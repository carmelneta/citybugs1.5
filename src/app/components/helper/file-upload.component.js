class UploadCtrl {
  
  constructor( $scope, $element, $timeout ) {
    'ngInject'; 

    this._$timeout = $timeout;
    this._$element = $element;
    this
    
    this.files = [];
    this.images = [];
    this.loading = false;
    this.loadingParts = 0;
    this.loadingState = 0;
 
  }


  _readImage(file) {
    var reader = new FileReader();

    reader.onload = (e) => {

      var _file = {
        src: e.target.result, 
        file: file
      }

       // get EXIF data
        EXIF.getData(file, () => {
          if(file.exifdata.GPSLatitude && file.exifdata.GPSLongitude) {
              var lat = file.exifdata.GPSLatitude;
              var lon = file.exifdata.GPSLongitude; 
              //Convert coordinates to WGS84 decimal
              var latRef = file.exifdata.GPSLatitudeRef || "N";  
              var lonRef = file.exifdata.GPSLongitudeRef || "W";  
              _file.position = {
                lat : (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef == "N" ? 1 : -1),  
                lng : (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef == "W" ? -1 : 1)
              }
          }

          this._$timeout( () => {
            this.images.push(_file);
            this.loadingState = this.loadingState + ( 100 /  this.loadingParts );        
          });

          // console.log(_file);

        }); 

    };

    reader.readAsDataURL(file);
 

  }

  _change(e) { 
    if (e.target.files && e.target.files[0]) {          
      this.loading = true;
      this.loadingParts = this.files.length;

      for(var i=0; i < e.target.files.length; i++) {
        this._readImage(e.target.files[i]);
      }
    }
    this.files.push(...e.target.files);
    this.onChange({files: this.files});
  }

  delImag(index) {
    this.images.splice(index, 1);
    files.splice(index,1);
    this.onChange({files});
  }

  delExsistImg(index, image) {
    this.onDelExsist({index});
  }
  useLocation($index, image) {
    this.onUseLocation({position: image.position});
  }
  test() {
    console.log(this.images);
  }

  open() {        
    this._$element.find('input')[0].click();
  }

  $onInit() {
    this._$element.find('input').bind("change", e => this._change(e));

    if(!this.label) { this.label = 'Images'; }
    if(!this.btntext) { this.btntext = 'Images'; }
  } 
}

export const FileUploadComponent = {
   bindings: {
      onChange    : '&',
      onDelExsist : '&',
      initImages  : '<',
      label       : '<',
      btntext     : '<',
      onUseLocation : '&'
    },
    controller: UploadCtrl,
    template: ` 
    <style>
      file-upload .container {
        position: relative;
      }
      file-upload .images {
        display: inline-block;
        border: 1px solid #efefef;
        box-shadow: 1px 1px 1px #efefef
      }
      file-upload .images > div {
        position: relative;          
        max-width: 33.3%;
        margin: 10px; 
        float: left;
      }
      
      file-upload .images button{
        position: absolute;
        margin: 0;
        padding: 0;
        top: -15px;
        right: -15px;
      }

      file-upload .images button.location {
        top: auto;
        bottom: 0;
      }

      file-upload .images img {
        max-width: 100%;
      }
    </style>

    <input class="hide" type="file" ng-model="$ctrl.file" multiple accept="image/*">
    <md-card>    
      <md-card-content>
         <div layout="row" layout-align="space-between center">
          <span>{{$ctrl.label}}</span>
          <md-button class="md-raised md-warn" ng-click="$ctrl.open()">
            {{$ctrl.btntext}}
          </md-button>    
        </div>

        <div layout="column" layout-align="space-between center">
          
          <div class="images">
            <div ng-repeat="image in $ctrl.images">
              <img ng-src="{{image.src}}">    
              <md-button class="md-icon-button md-raised md-primary" ng-click="$ctrl.delImag($index, image)" aria-label="toggle"><md-icon>clear</md-icon></md-button>
              <md-button ng-if="image.position" class="location md-icon-button md-raised md-primary" ng-click="$ctrl.useLocation($index, image)" aria-label="Use Location"><md-icon>room</md-icon></md-button>
            </div>
          </div>

          <div ng-if="$ctrl.initImages">            
            <h3>Exsisting Images</h3>
            <div class="images">
              <div ng-repeat="image in $ctrl.initImages">
                <img ng-src="{{image}}">    
                <md-button class="md-icon-button md-raised md-primary" ng-click="$ctrl.delExsistImg($index, image)" aria-label="toggle"><md-icon>clear</md-icon></md-button>
              </div>
            </div>
          </div>
        </div>
      </md-card-content>
    </md-card>      
      `
}