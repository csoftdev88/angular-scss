'use strict';
/*jshint -W109 */

angular.module('mobiusApp.directives.infinitiApeironScript', [])

  .directive('infinitiApeironScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {
        var env = document.querySelector('meta[name=environment]').getAttribute('content');
        var apeironSettings = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env] : null;

        if(apeironSettings && apeironSettings.enable)
        {
          var trackingIdScript = document.createElement('script');
          var trackingScriptTextString = 'window.infinitiTrack2InstallationId="'+ apeironSettings.id +'";';
          if(apeironSettings.segmentWriteId){
            trackingScriptTextString += '\n' + 'window.segmentWriteId="'+ apeironSettings.segmentWriteId +'";';
          }
          if(apeironSettings.singlePageApp){
            trackingScriptTextString += '\n' + 'window.infinitiSinglePageApp=true;';
          }
          var trackingScriptText = document.createTextNode(trackingScriptTextString);
          trackingIdScript.type = 'text/javascript';
          trackingIdScript.appendChild(trackingScriptText);
          document.head.appendChild(trackingIdScript);

          var trackingRemoteScript = document.createElement('script');
          trackingRemoteScript.type = 'text/javascript';
          trackingRemoteScript.src = Settings.infinitiApeironTracking[env].scriptUrl;
          document.head.appendChild(trackingRemoteScript);
        }
      }
    };
  });
