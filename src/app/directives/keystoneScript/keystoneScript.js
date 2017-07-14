'use strict';

angular
  .module('mobiusApp.directives.keystoneScript', [])
  .directive('keystoneScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      link: function() {
        if(Settings.authType === 'keystone') {
          var script = document.createElement('script');
          var env = document.querySelector('meta[name=environment]').getAttribute('content');
          script.src = Settings.keystone[env];
          document.head.appendChild(script);
        }
      }
    };
  });
