'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function(contentService, $state){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){

      // We are using different methods for getting the data
      // from the server according to content type. Also, menu
      // items are located under different objects.
      var contentTypes = {
        'news': {
          'sourceObject': 'news',
          'method': 'getNews',
          'state': 'news'
        },
        'offers': {
          'sourceObject': 'specialOffer',
          'method': 'getOffers',
          'state': 'offers'
        },
        'about': {
          'sourceObject': 'about',
          'method': 'getAbout',
          'state': 'aboutUs'
        }
      };

      scope.title = attrs.title;

      scope.goToState = function() {
        $state.go(contentTypes[attrs.menuContent].state);
      };

      var contentType = contentTypes[attrs.menuContent];
      if(contentType){
        contentService[contentType.method]().then(function(data){
          scope.content = data[contentType.sourceObject]||[];
        });
      }
    }
  };
});
