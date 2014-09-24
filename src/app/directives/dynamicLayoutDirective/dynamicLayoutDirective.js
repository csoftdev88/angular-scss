'use strict';

angular.module('mobiusApp.directives.layout', [])

.directive('dynamicLayout', function($compile, stateService, $state){
  return {
    restrict: 'EA',
    // Widget logic goes here
    link: function(scope, elem){
      //scope, elem, attrs
      var stateName = $state.current.name;

      var templates = stateService.getStateLayout(stateName);
      if(templates && templates.length){

        // Inserting new layout
        var content = angular.element(templates.join());
        elem.append(content);
        $compile(content);
      }
    }
  };
});
