(function(angular){
  const ctrl = function( $scope, $element, $timeout ) {
    
    var ctrl = this;
    
    var files = [];
    ctrl.images = [];
    ctrl.loading = false;
    ctrl.loadingParts = 0;
    ctrl.loadingState = 0;
 

    function _readImage(file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        // console.log(e);
                  
        $scope.$apply(function () {
          ctrl.images.push({src: e.target.result, file: file});
          ctrl.loadingState = ctrl.loadingState + ( 100 /  ctrl.loadingParts );
          if(ctrl.loadingState >0 === 100) {
            ctrl.loading = false;
          }
        });
      };


      reader.readAsDataURL(file);

    }

    function _change() { 

      if (this.files && this.files[0]) {          
        ctrl.loading = true;
        ctrl.loadingParts = this.files.length;
        for(var i=0; i < this.files.length; i++) {
          _readImage(this.files[i]);
        }
      }
      files.push(...this.files);
      ctrl.onChange({files});
    }

    ctrl.delImag = function(index) {
      this.images.splice(index, 1);
      files.splice(index,1);
      ctrl.onChange({files});
    }

    ctrl.delExsistImg = function(index, image) {
      ctrl.onDelExsist({index});
    }

    this.test = function() {
      console.log(this.images);
    }

    this.open = function() {        
      $element.find('input')[0].click();
    }

    this.$onInit = function() {
      $element.find('input').bind("change", _change);
    }

    this.$onChanges = function (changesObj) {
      if (changesObj.initImages && changesObj.initImages.currentValue) {
        
      console.log(changesObj.initImages);
      }
    }
  };

  angular.module('cityBugs').component('fileUpload', {
    
    bindings: {
      onChange    : '&',
      onDelExsist : '&',
      initImages  : '<'
    },
    controller: ctrl,
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
        file-upload .images img {
          max-width: 100%;
        }
    </style>

    <input class="hide" type="file" ng-model="$ctrl.file" multiple accept="image/*">
    <md-card>    
      <md-card-content>
         <div layout="row" layout-align="space-between center">
          <span>Images</span>
          <md-button class="md-raised md-warn" ng-click="$ctrl.open()">images</md-button>    
        </div>

        <div layout="column" layout-align="space-between center">
          
          <div class="images">
            <div ng-repeat="image in $ctrl.images">
              <img ng-src="{{image.src}}">    
              <md-button class="md-icon-button md-raised md-primary" ng-click="$ctrl.delImag($index, image)" aria-label="toggle"><md-icon>clear</md-icon></md-button>
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
  }); 

})(window.angular);