'use strict';

/**
 * Directive for formating text coming from admin markdown editor
 * used for styling page headings
 */

angular.module('mobiusApp.directives.markdownTextParser', [])

.directive('markdownTextParser', function(){
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {

      var parse = function() {
        angular.element($element).find('h1').each(function(){
          var txt = angular.element(this).html();
          var ar = txt.split(' ');
          var len = ar.length;
          var first = ar.shift();
          var second = len > 2 ? ar.shift(): '';
          var wrapped = '<strong>' + ar.join(' ') + '</strong>';
          angular.element(this).html(len > 2 ? (first + ' ' + second + ' ' + wrapped) : (first + ' ' + wrapped));
        });
      };

      $scope.$watch($attrs.ngBindHtml, function(html) { 
        if(!html){
          return;
        }
        parse();
      });

    }
  };
});
