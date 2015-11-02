'use strict';


/**
 * Directive for formating text coming from admin markdown editor
 * used for styling page headings
 */

angular.module('mobiusApp.directives.markdownTextParser', [])

.directive('markdownTextParser', function($location){
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {

      var parse = function() {
        //format headers
        angular.element($element).find('h1').each(function(){
          var txt = angular.element(this).html();
          var ar = txt.split(' ');
          var len = ar.length;
          var first = ar.shift();
          var second = len > 2 ? ar.shift(): '';
          var wrapped = '<strong>' + ar.join(' ') + '</strong>';
          angular.element(this).html(len > 2 ? (first + ' ' + second + ' ' + wrapped) : (first + ' ' + wrapped));
        });
        //add target blank to links if not linking to current host
        var host = $location.host();
        console.log('host: ' + host);
        angular.element($element).find('a').each(function(){
          var href = angular.element(this).attr('href');
          console.log('href: ' + href);
          if(href.indexOf(host) === -1 && href.indexOf('http') !== -1){
            angular.element(this).attr('target', '_blank');
          }
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
