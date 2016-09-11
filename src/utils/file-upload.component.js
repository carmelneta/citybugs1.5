(function(angular){

  angular.module('cityBugs').component('fileUpload', {
    template: ` 
    <style>
      file-upload .container{
        border: 1px solid;
        padding: 20px;
        position: relative;
      }
      file-upload .images {
        display: inline-block;
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

    <div class="container">
      <input class="hide" type="file" ng-model="$ctrl.file" multiple accept="image/*">
      
      <md-button class="md-raised md-primary" ng-click="$ctrl.open()">Choose</md-button>
      <md-button class="md-raised md-warn" ng-click="$ctrl.test()">Choose</md-button>
 
      <md-progress-linear md-mode="determinate" ng-show="$ctrl.loading" value="{{$ctrl.loadingState}}"></md-progress-linear>

      <div class="images">
        <div ng-repeat="image in $ctrl.images">
          <img ng-src="{{image.src}}">    
          <md-button class="md-icon-button md-raised md-primary" ng-click="$ctrl.delImag($index, image)" aria-label="toggle"><md-icon>clear</md-icon></md-button>
        </div>
      </div>
    </div>
      
      `,
    bindings: {model: '='},
    controller: function( $scope, $element, $timeout ) {
      
      var ctrl = this;
      
      ctrl.images = [];
      ctrl.loading = false;
      ctrl.loadingParts = 0;
      ctrl.loadingState = 0;

      ctrl.model = ctrl.images;

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
      }

      ctrl.delImag = function(index, image) {
        // alert("asd");
        // console.log(index, image);
        // this.images[index];
        this.images.splice(index, 1);
      }

      this.test = function() {
        console.log(this.images);
      }

      this.open = function() {        
        $element.find('input')[0].click();
        // console.log( $element.find('input'));
      }

      this.$onInit = function() {
        $element.find('input').bind("change", _change);
      }
    }
  }); 

})(window.angular);