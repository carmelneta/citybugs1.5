import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './components/home/home.component';
import { UsersInit } from './components/users/users.index';
import { UserServiceClass, Auth } from './components/users/user.service';
import { LoginComponent } from './components/users/login/login.component';
import { ObsInit, ObsComponent } from './components/obs/obs.index';



//  Helpers
import { FileUploadComponent } from './components/helper/file-upload.component';
import { ObsMapComponent } from './components/helper/obs-map.component';

var app = angular.module('cityBugs', ['ngAnimate', 'ngRoute','ngCookies', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'firebase']);
app
  .config(config)
  .config(routerConfig)
  .run(runBlock)

  //  Services
  .factory('Auth', Auth)
  .service('UserService', UserServiceClass)

  //  Helpers Components
  .component('fileUpload', FileUploadComponent)
  .component('obsMap', ObsMapComponent)


  //  Main Views
  .component('main.component', MainComponent)
  .component('pageHome', HomeComponent)
  .component('login.component', LoginComponent)


  ;

ObsInit(app);
UsersInit(app);