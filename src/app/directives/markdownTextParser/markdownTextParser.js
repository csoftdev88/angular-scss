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

        //Replace [[SIGNUP]] string with signup button
        if(angular.element($element).html().indexOf('[[SIGNUP]]') !== -1){
          angular.element($element).html(angular.element($element).html().replace(/\[\[SIGNUP\]\]/gi, '<div class="signup-replace"></div>'));
          var toReplace = angular.element($element).find('.signup-replace');
          var replaceWith = angular.element($element).parent().find('.login');
          toReplace.replaceWith(replaceWith);
          //$compile(replaceWith)($scope);
          replaceWith.removeClass('hide');

        }

        //Replace [[CLEAR]] with a div with class clear
        if(angular.element($element).html().indexOf('[[CLEAR]]') !== -1){
          angular.element($element).html(angular.element($element).html().replace(/\[\[CLEAR\]\]/gi, '<div class="clear"></div>'));
        }
        
        
      };

      $scope.$watch($attrs.ngBindHtml, function(html) {
        if(!html){
          return;
        }
        parse();
      });

      $scope.$watch($attrs.bindUnsafe, function(html) {
        if(!html){
          return;
        }
        parse();
      });

    }
  };
});
