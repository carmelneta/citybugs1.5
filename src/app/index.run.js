export function runBlock ($log, $rootScope, $transitions) {
  'ngInject';
  $log.debug('runBlock end', $transitions);
  
  $transitions.onError({ to: 'main.users.*' }, function() {
    console.log('Error Transisiton');
    //return AsyncService.doSomeAsyncThing();
  });

  $transitions.onStart( { to: 'main.users.*' }, function( $state) {
    'ngInject';
    console.log('asd');
});
}
