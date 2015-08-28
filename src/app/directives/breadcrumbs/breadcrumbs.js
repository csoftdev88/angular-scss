'use strict';

angular.module('mobiusApp.directives.breadcrumbs', [])

  .directive('breadcrumbs', function( $state, $window, breadcrumbsService, _,
      modalService, scrollService, contentService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/breadcrumbs/breadcrumbs.html',

      // Widget logic goes here
      link: function(scope) {
        var EVENTS_SCROLL_RESIZE = 'scroll resize';

        var unWatchBreadcrumbs = scope.$watch(
          function() {
            return breadcrumbsService.getBreadCrumbs();
          },
          function(breadcrumbs) {
            if(scope.breadcrumbs === breadcrumbs){
              return;
            }

            scope.breadcrumbs = breadcrumbs || [];
          }
        );

        var unWatchHrefs = scope.$watch(
          function() {
            return breadcrumbsService.getHrefs();
          },
          function(hrefs) {
            if(scope.hrefs === hrefs){
              return;
            }
            scope.hrefs = hrefs || [];
          }
        );

        var unWatchAbsHrefs = scope.$watch(
          function() {
            return breadcrumbsService.getAbsHrefs();
          },
          function(absHrefs) {
            if(scope.absHrefs === absHrefs){
              return;
            }
            scope.absHrefs = absHrefs || [];
          }
        );

        var unWatchActiveHref = scope.$watch(
          function() {
            return breadcrumbsService.getActiveHref();
          },
          function(activeHref) {
            if(scope.activeHref === activeHref){
              return;
            }
            scope.activeHref = activeHref;
          }
        );

        var onScrollDebounced = _.debounce(function(){
          var activeHref = breadcrumbsService.getVisibleHref();
          if(activeHref){
            activeHref = _.findWhere(scope.hrefs, {id: activeHref.id});
          }

          scope.$evalAsync(function(){
            scope.scrollActiveHref = activeHref || null;
          });
        }, 250);

        // Scroll listener
        angular.element($window).bind(EVENTS_SCROLL_RESIZE, onScrollDebounced);

        scope.$on('$destroy', function() {
          // TODO move wathers,listeners into an array
          unWatchBreadcrumbs();
          unWatchHrefs();
          unWatchActiveHref();
          unWatchAbsHrefs();

          angular.element($window).unbind(EVENTS_SCROLL_RESIZE, onScrollDebounced);
        });

        // TODO: Unify across the app
        scope.scrollTo = function(href) {
          // TODO - handle this in a better way
          if(href === 'fnOpenLightBox'){
            modalService.openGallery(contentService.getLightBoxContent(scope.heroContent));
            return;
          }

          scope.activeHref = _.find(scope.hrefs, {id: href}).name;
          var $item = angular.element('#' + href);
          if($item.length){
            scrollService.scrollTo(href, 20);
          }
        };

        scope.$state = $state;
      }
    };
  })
;
