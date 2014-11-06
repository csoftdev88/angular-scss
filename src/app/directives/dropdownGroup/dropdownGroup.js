'use strict';

angular.module('mobiusApp.directives.dropdown.group', [])

.directive('dropdownGroup', function($document) {
  return {
    restrict: 'CA',
    scope: {},
    priority: 1200,

    link: function(scope, elem){
      console.log(elem);
      var CLICK_EVENT = 'click',
          ENTER_EVENT = 'mouseenter',
          LEAVE_EVENT = 'mouseleave',
          ATTR_NAME = 'has-dropdown',
          OPEN_CLASS = 'open',
          items, mobile;

      // Local functions
      var clickEvent, mouseEvent, bindHandlers, closeAll;

      clickEvent = function(isClickable, event){
        // On smaller screen is everything clickable
        if( mobile || isClickable ){

          if (!this.isOpened){
            closeAll();
            this.open();
          } else {
            this.close();
          }
        }
        // Prevent closing parent menu
        event.stopPropagation();
      };

      mouseEvent = function(active){
        // Hover functionality works only on bigger screens
        if (!mobile) {
          if (active) {
            closeAll();
            this.open();
          } else {
            this.close();
          }
        }
      };

      // Bind handlers
      bindHandlers = function(i, item){
        var $item = angular.element(item),
            attr = $item.attr(ATTR_NAME);

        // Early return for not including in set of dropdowns
        if ( !attr ){ return; }

        $item.isOpened = false;

        if ( attr === 'hover'){
          $item.on( ENTER_EVENT,  mouseEvent.bind($item, true) );
          $item.on( LEAVE_EVENT,  mouseEvent.bind($item, false) );
          $item.on( CLICK_EVENT,  clickEvent.bind($item, false) );
        } else {
          $item.on( CLICK_EVENT,  clickEvent.bind($item, true) );
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
      };

      // Init handlers on elements and throw away those without dropdowns
      items = elem.children().map(bindHandlers);

      closeAll = function(){
        items.each(function(i, $item){ $item.close(); });
      };

      // Listen to viewport changes to adjust behaviour
      scope.$on('viewport:resize', function(event, viewport){
        mobile = viewport.mobile;
      });

      // Listen to click events outside of menu area to close items
      $document.bind(CLICK_EVENT, closeAll);

      // Clean up the mess ofter destroy
      scope.$on('$destroy', function(){
        $document.unbind('click', closeAll);
        items.each(function(i, $item){ $item.off(); });
      });
    }
  };
});
