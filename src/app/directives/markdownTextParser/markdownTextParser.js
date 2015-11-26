'use strict';


/**
 * Directive for formating text coming from admin markdown editor
 * used for styling page headings
 */

angular.module('mobiusApp.directives.markdownTextParser', [])

.directive('markdownTextParser', function($location, Settings){
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {

      var parse = function() {
        var removeLinkWithValues = Settings.UI.markdown.removeLinksWithString;

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
        //Also remove links with predefined values in settings
        var host = $location.host();
        angular.element($element).find('a').each(function(){

          var link = angular.element(this);
          var href = link.attr('href');

          if(href.indexOf(host) === -1 && href.indexOf('http') !== -1){
            link.attr('target', '_blank');
          }

          var val = link.html();
          for(var i = 0; i < removeLinkWithValues.length; i++){
            if(removeLinkWithValues[i] === val){
              link.remove();
            }
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
