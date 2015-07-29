'use strict';

/**
 * Directive for embedding the forms thru the data
 */
angular.module('mobiusApp.directives.embeddedForm', [])

  .directive('embeddedForm', function($templateCache){
    return {
      restrict: 'E',
      // Validation logic
      link: function(scope, elem, attrs){
        var SNIPPET_TEMPLATE_PATH = 'directives/embeddedForm/snippets/:type.html';

        if(!attrs.type){
          // Form type is not defined
          throw new Error('Embedded form type is not defined');
        }

        var template = $templateCache.get(SNIPPET_TEMPLATE_PATH.replace(':type', attrs.type));

        if(!template){
          // Snippet not found
          throw new Error('Cannot find the corresponding template of type:' + attrs.type);
        }

        elem.append(template);
      }
    };
  });
