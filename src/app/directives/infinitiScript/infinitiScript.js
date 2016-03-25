'use strict';
/*jshint -W109 */
//TODO: when confirmed this is needs to be removed as replaced by evolution script, currently this is disabled in Settings.infinitiUrl.enable
angular.module('mobiusApp.directives.infinitiScript', [])

  .directive('infinitiScript', function(Settings, $location) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {

        if(Settings.authType !== 'infiniti' || !Settings.infinitiUrl.enable){
          return;
        }

        var url = $location.host() === Settings.productionHost ? Settings.infinitiUrl.production : Settings.infinitiUrl.development;
        var script = document.createElement( 'script' );
        script.type = 'text/javascript';
        script.src = url;
        document.head.appendChild(script);

      }
    };
  });
