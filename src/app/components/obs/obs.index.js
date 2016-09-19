import { ObsViewComponent } from './obs.view.component';
import { ObImageClass } from './ob-image.component';
import { ObsCardComponent } from './ob-card/ob-card.component';
import { ObsService } from './obs.service';
import { AddObComponent, EditObComponent } from './add.component/add.component'
import { MarkObsComponent } from './marked-obs.component';
import { ObsNearComponent } from './obs.near.component';
import { GeoFireService } from './geofire.service';


function obsRoutes ($stateProvider) { 
  'ngInject';


  var obsIndexState = {
    abstract: true,
    name: 'main.obs',
    url : 'obs',
    component: 'obs.index'
  }

  var viewState = {
    name: 'main.obs.view',
    url: '/view/{obId}',
    component: 'obs.view.component',
    resolve: {
      obId: $transition$ => {
        'ngInject'; 
        return $transition$.params().obId;
      }
    }
  };

  var editState = {
    name: 'main.obs.edit',
    url: '/edit/{obId}',
    component: 'obs.edit.component',
    resolve: {
      currentAuth: Auth => {
        'ngInject';
        return Auth.$requireSignIn();
      },
      obId: $transition$ => {
        'ngInject';
        return $transition$.params().obId;
      }
    }
  };

  var addState = {
    name: 'main.obs.add',
    url: '/add',
    component: 'obs.add.component'
  };

  var markedObsState = {
    name: 'main.obs.marked',
    url: '/marked',
    component: 'obs.marked.component',
    resolve: {
      currentAuth: Auth => {
        'ngInject';
        return Auth.$requireSignIn();
      }
    }
  }

  $stateProvider.state(obsIndexState); 
  $stateProvider.state(viewState); 
  $stateProvider.state(addState); 
  $stateProvider.state(editState); 
  $stateProvider.state(markedObsState); 
}

class Ctrl {
  constructor ( ) {
    'ngInject';    
    console.log('Obs Compoennet');
  }  
}


export const ObsComponent = {
  template: '<ui-view></ui-view>', 
  controller: Ctrl
}

export function ObsInit(app) {
  app
    .config(obsRoutes)
    .component('obs.index', ObsComponent) 
    .service('ObsService', ObsService)
    .service('GeoFireService', GeoFireService)

    .component('obImage', ObImageClass)
    .component('obCard', ObsCardComponent)
    .component('obsNear', ObsNearComponent)

    .component('obs.view.component', ObsViewComponent)
    .component('obs.add.component', AddObComponent)
    .component('obs.edit.component', EditObComponent)
    .component('obs.marked.component', MarkObsComponent)
  ;
}
