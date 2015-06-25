'use strict';

angular.module('mobiusApp.directives.breadcrumbs', [])

  .directive('breadcrumbs', function(breadcrumbsService, _, $state) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/breadcrumbs/breadcrumbs.html',

      // Widget logic goes here
      link: function(scope) {
        var unWatchBreadcrumbs = scope.$watch(
          function() {
            return breadcrumbsService.getBreadCrumbs();
          },
          function(breadcrumbs) {
            scope.breadcrumbs = breadcrumbs || [];
          }
        );
        var unWatchHrefs = scope.$watch(
          function() {
            return breadcrumbsService.getHrefs();
          },
          function(hrefs) {
            scope.hrefs = hrefs || [];
          }
        );
        var unWatchActiveHref = scope.$watch(
          function() {
            return breadcrumbsService.getActiveHref();
          },
          function(activeHref) {
            scope.activeHref = activeHref;
          }
        );
        scope.$on('$destroy', function() {
          unWatchBreadcrumbs();
          unWatchHrefs();
          unWatchActiveHref();
        });

        scope.scrollTo = function(href) {
          scope.activeHref = _.find(scope.hrefs, {id: href}).name;
          var $item = angular.element('#' + href);
          angular.element('html, body').animate({
            scrollTop: $item.offset().top
          }, 300);
        };

        scope.$state = $state;
      }
    };
  })
;
