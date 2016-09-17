export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  const mainState = {
    name: 'main',
    abstract: true,
    url: '/',
    component: 'main.component'
  }
  
  const homeState = {
    name: 'main.home',
    url: '',
    component: 'home.component',
    resolve: googleMaps.resolver
  }; 


  const loginState = {
    name: 'main.login',
    url: '/login',
    component: 'login.component'
  }; 

  $stateProvider.state(mainState);
  $stateProvider.state(homeState); 
  $stateProvider.state(loginState); 

  $urlRouterProvider.otherwise('/');
}
