'use strict';
/*
* Autofill-sync of the form elements in browsers
*/
angular.module('mobius.controllers.common.autofillSync', [])

.controller( 'AutofillSyncCtrl', function($scope, $rootScope, $timeout, Settings) {
  var INPUT_TYPES = [
    'input',
    'textarea',
    'select'
  ];

  var EVENT_TYPES = [
    'change',
    'keydown'
  ];

  $scope.autofillSync = function(delay){
    $timeout(function(){
      // Finding all form elements
      var forms = angular.element.find('form');
      if(!forms || !forms.length){
        return;
      }

      var inputs = angular.element(forms).find(INPUT_TYPES.join(','));

      if(!inputs && !inputs.length){
        return;
      }

      // Triggering change events on corresponding inputs
      EVENT_TYPES.forEach(function(e){
        if($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest'){
          inputs.trigger(e);
        }
      });
    }, delay || Settings.UI.autoprefill && Settings.UI.autoprefill.delay?Settings.UI.autoprefill.delay:0);
  };
});
