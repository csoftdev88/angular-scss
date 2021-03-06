/**
 * Directive used to attach event listeners to control the drop down menu, please note an element
 * with this directive requires the has-dropdown="event" attribute.
 *
 * All content is generated via the content controller in which the key passed through menu-content="key"
 * is used to lookup how the content should be retrieved.
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp.directives.menu', [])
    .directive('menuContent', MenuContent);

  function MenuContent($controller, _, $state, $document, Settings) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/menuContent/menuContent.html',
      link: function(scope, elem, attrs){
        var EVENT_CLICK = 'click',
          EVENT_ENTER = 'mouseenter',
          EVENT_LEAVE = 'mouseleave',
          EVENT_VIEWPORT_RESIZE = 'viewport:resize',
          ATTR_NAME = 'has-dropdown',
          OPEN_CLASS = 'open',
          items, isMobile;

        var states = {
          'hotels': ['hotel', 'hotels', 'room'],
          'news': ['news'],
          'offers': ['offers'],
          'about': ['aboutUs'],
          'deals': ['hotel-deals']
        };

        scope.title = attrs.title;
        scope.item = attrs.menuContent;
        scope.disableTitleClick = (attrs.disableTitleClick === 'true');

        $controller('ContentCtr', {$scope: scope});

        scope.isActive = function() {
          return _.some(states[attrs.menuContent], function(state) {
            return $state.includes(state);
          });
        };

        scope.hasFilteredItems = function(content) {
          return _.some(content, function(item) {
            return !item.filtered;
          });
        };

        scope.hasSecondLevelDropdown = Settings.UI.menu.hasSecondLevelDropdown || false;

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

        /**
         * Function passed to map over each li element in the menu and attach event listeners to
         * add the open class when the menu item has been either clicked or been hovered over.
         * @param i
         * @param item
         */
        function bindHandlers(i, item){
          var $item = angular.element(item),
            attr = $item.attr(ATTR_NAME);
          // Early return for not including in set of dropdowns
          if (!attr ) {
            return;
          }

          $item.isOpened = false;

          if ( attr === 'hover') {
            $item.on( EVENT_ENTER,  mouseEventHandler.bind($item, true) );
            $item.on( EVENT_LEAVE,  mouseEventHandler.bind($item, false) );
          }

          $item.open = function() {
            $item.isOpened = true;
            $item.children().addClass(OPEN_CLASS);
          };

          $item.close = function() {
            $item.isOpened = false;
            $item.children().removeClass(OPEN_CLASS);
          };

          return $item;
        }

        // Init handlers on elements and throw away those without dropdowns
        items = elem.find('li').map(bindHandlers);

        function closeAll() {
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
  }

}());
