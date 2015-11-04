'use strict';

angular.module('mobiusApp.directives.dropdown.group', [])

.directive('dropdownGroup', function($document) {
  return {
    restrict: 'CA',
    scope: {},
    priority: 1200,

    link: function(scope, elem){
      var EVENT_CLICK = 'click',
          EVENT_ENTER = 'mouseenter',
          EVENT_LEAVE = 'mouseleave',
          EVENT_VIEWPORT_RESIZE = 'viewport:resize',
          ATTR_NAME = 'has-dropdown',
          OPEN_CLASS = 'open',
          items, isMobile;

      function clickHandler(isClickable, event){
        // On smaller screen is everything clickable
        if( isMobile || isClickable ){
          /* jshint validthis:true */
          if (!this.isOpened){
            closeAll();
            /* jshint validthis:true */
            this.open();
          } else {
            /* jshint validthis:true */
            this.close();
          }
        }
        // Prevent closing parent menu
        event.stopPropagation();
      }

      function mouseEventHandler(active){
        // Hover functionality works only on bigger screens
        if (!isMobile) {
          if (active) {
            closeAll();
            /* jshint validthis:true */
            this.open();
          } else {
            /* jshint validthis:true */
            this.close();
          }
        }
      }

      // Bind handlers
      function bindHandlers(i, item){
        var $item = angular.element(item),
            attr = $item.attr(ATTR_NAME);

        // Early return for not including in set of dropdowns
        if ( !attr ){ return; }

        $item.isOpened = false;

        if ( attr === 'hover'){
          $item.on( EVENT_ENTER,  mouseEventHandler.bind($item, true) );
          $item.on( EVENT_LEAVE,  mouseEventHandler.bind($item, false) );
          $item.on( EVENT_CLICK,  clickHandler.bind($item, false) );
        } else {
          $item.on( EVENT_CLICK,  clickHandler.bind($item, true) );
        }

        $item.open = function(){
          $item.isOpened = true;
          $item.children().addClass(OPEN_CLASS);
        };

        $item.close = function(){
          $item.isOpened = false;
          $item.children().removeClass(OPEN_CLASS);
        };

        return $item;
      }

      // Init handlers on elements and throw away those without dropdowns
      items = elem.children().map(bindHandlers);

      function closeAll(){
        console.log('dropdownGroup');
        document.body.classList.remove('mobile-menu-active');
        items.each(function(i, $item){ $item.close(); });
      }

      // Listen to viewport changes to adjust behaviour
      scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
        isMobile = viewport.isMobile;
      });

      // Listen to click events outside of menu area to close items
      $document.bind(EVENT_CLICK, closeAll);

      // Clean up the mess ofter destroy
      scope.$on('$destroy', function(){
        $document.unbind(EVENT_CLICK, closeAll);
        items.each(function(i, $item){ $item.off(); });
      });
    }
  };
});
