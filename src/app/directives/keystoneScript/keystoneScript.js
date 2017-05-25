'use strict';

angular
  .module('mobiusApp.directives.keystoneScript', [])
  .directive('infinitiApeironScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',
      link: function() {
        if(Settings.authType === 'keystone') {
          var script = document.createElement('script');
          script.src = Settings.keystone.development;
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
