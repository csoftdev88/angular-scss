'use strict';

// thanks http://stackoverflow.com/questions/15264051/how-to-use-ng-class-in-select-with-ng-options#answer-15278483

angular.module('mobiusApp.directives.chosenOptionsClass', [])

  .directive('chosenOptionsClass', function($parse) {
    return {
      require: 'select',
      restrict: 'A',
      link: function(scope, elem, attrs) {
        // get the source for the items array that populates the select.
        var optionsSourceStr = attrs.ngOptions.split(' ').pop(),
        // use $parse to get a function from the options-class attribute
        // that you can use to evaluate later.
          getOptionsClass = $parse(attrs.chosenOptionsClass);

        function setClasses(items) {
          angular.forEach(items, function(item, index) {
            // evaluate against the item to get a mapping object for
            // for your classes.
            var classes = getOptionsClass(item),
            // also get the option you're going to need. This can be found
            // by looking for the option with the appropriate index in the
            // value attribute.
              option = elem.parent().find('.chosen-results li[data-option-array-index=' + (index+1) + ']');

            // now loop through the key/value pairs in the mapping object
            // and apply the classes that evaluated to be truthy.
            angular.forEach(classes, function(add, className) {
              if (add) {
                angular.element(option).addClass(className);
              } else {
                angular.element(option).removeClass(className);
              }
            });
          });
        }

        var unWatchOptions = scope.$watch(optionsSourceStr, function(items) {
          elem.on('chosen:showing_dropdown', setClasses.bind(null, items));
        });
        scope.$on('$destroy', function(){
          unWatchOptions();
        });
      }
    };
  })
;