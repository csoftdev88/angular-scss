/**
 * AngularJS directives for social sharing buttons - Facebook Like, Google+, Twitter and Pinterest 
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.2.0
 */
'use strict';
(function () {
  angular.module('angulike', [])
    .directive('fbLike', [
      '$window', '$rootScope', function ($window, $rootScope) {
        return {
          restrict: 'A',
          scope: {
            fbLike: '=?'
          },
          link: function (scope, element, attrs) {
            var watchAdded = false;
            function renderLikeButton() {
              if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
                // wait for data if it hasn't loaded yet
                watchAdded = true;
                var unbindWatch = scope.$watch('fbLike', function (newValue) {
                  if (newValue) {
                    renderLikeButton();
                    // only need to run once
                    unbindWatch();
                  }
                });
                return;
              } else {
                element.html('<div class="fb-share-button"' + (!!scope.fbLike ? ' data-href="' + scope.fbLike + '"' : '') + ' data-layout="icon" data-width="32" data-height="32"></div>');
                $window.FB.XFBML.parse(element.parent()[0]);
              }
            }
            if (!$window.FB) {
              // Load Facebook SDK if not already loaded
              $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                $window.FB.init({
                  appId: $rootScope.facebookAppId,
                  xfbml: true,
                  version: 'v2.0'
                });
                renderLikeButton();
              });
            } else {
              renderLikeButton();
            }
            
          }
        };
      }
    ]);

})();
