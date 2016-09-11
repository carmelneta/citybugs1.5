(function(angular){

  angular.module('cityBugs').component('fileUpload', {
    template: `<div class="container">
      <input type="file" ng-model="$ctrl.file" multiple accept="image/*">
      
    <md-progress-linear md-mode="determinate" ng-show="$ctrl.loading" value="{{$ctrl.loadingState}}"></md-progress-linear>

      <div class="images">
        <div ng-repeat="image in $ctrl.images">
          <img ng-src="{{image.src}}">
          
          <md-button class="md-icon-button md-raised md-primary" ng-click="$ctrl.delImag()" aria-label="toggle"><md-icon>clear</md-icon></md-button>
        </div>
      </div> 
      </div>
      

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
      `,
    bindings: {model: '='},
    controller: function( $scope, $element, $timeout ) {
      
      var ctrl = this;
      
      ctrl.images = [];
      ctrl.loading = false;
      ctrl.loadingParts = 0;
      ctrl.loadingState = 0;

      function _readImage(file) {
        var reader = new FileReader();

        reader.onload = function (e) {
          console.log(e);
                    
          $scope.$apply(function () {
            ctrl.images.push({src: e.target.result});
            ctrl.loadingState = ctrl.loadingState + ( 100 /  ctrl.loadingParts );
            if(ctrl.loadingState >0 === 100) {
              ctrl.loading = false;
            }
          });
        };


        reader.readAsDataURL(file);

      }

      function _change(){

        // console.log('Change', this);
        ctrl.model = this.files; 
        ctrl.images = [];

        if (this.files && this.files[0]) {          
          ctrl.loading = true;
          ctrl.loadingParts = this.files.length;
          for(var i=0; i < this.files.length; i++) {
            _readImage(this.files[i]);
          }
        }
      }

      ctrl.delImag = function(){
        alert("asd");
      }
      this.$onInit = function() {
        $element.find('input').bind("change", _change);
      }
    }
  }); 

})(window.angular);