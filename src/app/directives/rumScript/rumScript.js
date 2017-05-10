'use strict';
/*jshint -W043 */

angular.module('mobiusApp.directives.rumScript', [])

  .directive('rumScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',
      link: function() {
        if(Settings.rumScript && Settings.rumScript.enable && Settings.rumScript.id) {
          // Tell jshint to ignore this as we need to use double quotes to encapsulate single quotes
          /*jshint ignore:start */
          var trackingRemoteScript = document.createElement('script');
          trackingRemoteScript.type = 'text/javascript';
          var scriptString = "var _prum = [['id', '" + Settings.rumScript.id +"'], \
            ['mark', 'firstbyte', (new Date()).getTime()]]; \
          (function() { \
            var s = document.getElementsByTagName('script')[0] \
              , p = document.createElement('script'); \
            p.async = 'async'; \
            p.src = '//rum-static.pingdom.net/prum.min.js'; \
            s.parentNode.insertBefore(p, s); \
          })();";

          trackingRemoteScript.text = scriptString;
          document.head.appendChild(trackingRemoteScript);
          /*jshint ignore:end */
        }
      }
    };
  });

