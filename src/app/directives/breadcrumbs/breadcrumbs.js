'use strict';

angular.module('mobiusApp.directives.breadcrumbs', [])

  .directive('breadcrumbs', function( $state, breadcrumbsService, _,
      modalService) {
    return {
      restrict: 'E',
      scope: true,
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

        // TODO: Unify across the app
        scope.scrollTo = function(href) {
          // TODO - handle this in a better way
          if(href === 'fnOpenLightBox'){
            modalService.openGallery(scope.heroContent.map(function(item){
              return item.uri;
            }));
            return;
          }

          scope.activeHref = _.find(scope.hrefs, {id: href}).name;
          var $item = angular.element('#' + href);
          if($item.length){
            angular.element('html, body').animate({
              scrollTop: $item.offset().top
            }, 300);
          }
        };

        scope.$state = $state;
      }
    };
  })
;
