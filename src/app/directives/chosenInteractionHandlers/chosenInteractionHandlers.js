'use strict';

angular.module('mobiusApp.directives.chosenInteractionHandlers', [])
  .directive('select', function(deviceDetector) {
    return {
      restrict: 'E',
      link: function(scope, elem) {
        var htmlEl = angular.element('html');

        //Fix for ipad safari losing fixed elements when chosen is interacted with
        if(deviceDetector.device === 'ipad' && deviceDetector.browser === 'safari'){
          elem.on('chosen:hiding_dropdown', function(){
            elem.removeClass('chosen-active');
            htmlEl.removeClass('form-element-focused');
          });
          elem.on('chosen:showing_dropdown', function(){
            elem.removeClass('chosen-active');
            elem.addClass('chosen-active');
            htmlEl.removeClass('form-element-focused');
            htmlEl.addClass('form-element-focused');
          });
        }
      }
    };
  })
;
