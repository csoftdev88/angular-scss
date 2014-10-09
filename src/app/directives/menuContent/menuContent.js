'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function(contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){
      var EVENT_MOUSE_ENTER = 'mouseenter';
      var EVENT_MOUSE_LEAVE = 'mouseleave';

      // We are using different methods for getting the data
      // from the server according to content type. Also, menu
      // items are located under different objects.
      var contentTypes = {
        'news': {
          'sourceObject': 'news',
          'method': 'getNews'
        },
        'offers': {
          'sourceObject': 'specialOffers',
          'method': 'getOffers'
        },
        'about': {
          'sourceObject': 'abouts',
          'method': 'getAbout'
        }
      };

      scope.title = attrs.title;
      var contentType  = contentTypes[attrs.menuContent];

      if(contentType){
        contentService[contentType.method]().then(function(data){
          scope.content = data[contentType.sourceObject]||[];
          console.log(scope.content);
        });
      }

      elem.bind(EVENT_MOUSE_ENTER, function(){
        onMouseEvent(true);
      });

      elem.bind(EVENT_MOUSE_LEAVE, function(){
        onMouseEvent(false);
      });

      function onMouseEvent(active){
        scope.active = active;
        scope.$apply();
      }

      // Removing all listeners when component is destroyed
      scope.$on('$destroy', function(){
        elem.unbind(EVENT_MOUSE_ENTER);
        elem.unbind(EVENT_MOUSE_LEAVE);
      });
    }
  };
});
