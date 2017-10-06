(function () {
  'use strict';

  angular
    .module('mobiusApp.directives.spinner', [])
    .directive('fullscreenSpinner', ['$rootScope', FullScreenSpinner]);

  function FullScreenSpinner($rootScope) {
    return {
      restrict: 'E',
      scope: {},
      // Use an inlined template to avoid having to replicate across all targets
      template: '<div id="fullscreen-spinner" ng-show="vm.spinner.show">' +
      '  <div class="fullscreen-spinner__message">{{ vm.spinner.message }}</div>' +
      '  <div class="fullscreen-spinner__spinner sk-three-bounce">' +
      '    <div class="fullscreen-spinner__dot dot1"></div>' +
      '    <div class="fullscreen-spinner__dot dot2"></div>' +
      '    <div class="fullscreen-spinner__dot dot3"></div>' +
      '  </div>' +
      '</div>',
      controller: SpinnerController,
      controllerAs: 'vm',
      bindToController: true
    };

    function SpinnerController() {
      var vm = this;
      vm.spinner = $rootScope.spinner;
    }
  }
}());
