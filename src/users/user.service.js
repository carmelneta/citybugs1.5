var myModule = angular.module('cityBugs')
 
.factory("Auth", function($firebaseAuth) {
  return $firebaseAuth();
});