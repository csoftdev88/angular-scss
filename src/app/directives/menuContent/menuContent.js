'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function(contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){
      var EVENT_MOUSE_ENTER = 'mouseenter',
          EVENT_MOUSE_LEAVE = 'mouseleave',
          EVENT_MOUSE_CLICK = 'click',
          mobile;

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

      scope.$on('viewport:resize', function(event, viewport){
        mobile = viewport.mobile;
      });

      scope.title = attrs.title;
      var contentType = contentTypes[attrs.menuContent];

      if(contentType){
        contentService[contentType.method]().then(function(data){
          scope.content = data[contentType.sourceObject]||[];
        });
      }

      elem.bind(EVENT_MOUSE_ENTER, function(){
        onMouseEvent(true);
      });

      elem.bind(EVENT_MOUSE_LEAVE, function(){
        onMouseEvent(false);
      });

      function onMouseEvent(active){
        if (!mobile){
          scope.active = active;
          scope.$apply();
        }
      }

      elem.bind(EVENT_MOUSE_CLICK, function(event){
        console.log(event, mobile);
        // Execute only on mobile
        if (mobile){
          // Prevent event bubbling to prevent
          // menu closing when there is a submenu
          event.stopPropagation();
          scope.active = !scope.active;
          scope.$apply();
        }
      });

      // Removing all listeners when component is destroyed
      scope.$on('$destroy', function(){
        elem.unbind(EVENT_MOUSE_ENTER);
        elem.unbind(EVENT_MOUSE_LEAVE);
      });
    }
  };
});
