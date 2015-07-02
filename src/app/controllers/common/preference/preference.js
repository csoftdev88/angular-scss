'use strict';
/*
 * This module contains methods setting/getting user
 * UI preferences
 */
angular.module('mobius.controllers.common.preference', [
  'mobiusApp.services.preference'
])

.controller( 'PreferenceCtrl', function($scope, preferenceService) {
  $scope.preference = {
    set: preferenceService.set,
    setDefault: preferenceService.setDefault,
    get: preferenceService.get
  };
});
