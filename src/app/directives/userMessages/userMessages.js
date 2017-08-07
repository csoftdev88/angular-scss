'use strict';

angular.module('mobiusApp.directives.userMessages', [])

  .directive('userMessages', ['userMessagesService', '$controller', '$timeout', '$rootScope', 'stateService',
    function(userMessagesService, $controller, $timeout, $rootScope, stateService) {

    return {
      restrict: 'E',
      templateUrl: 'directives/userMessages/userMessages.html',

      // Widget logic goes here
      link: function(scope) {

        $controller('SanitizeCtrl', {$scope: scope});

        scope.closeMessage = function(index) {
          if (0 <= index && index < scope.messages.length) {
            scope.messages.splice(index, 1);
            if (!stateService.isMobile()) {
              $timeout(function () {
                document.body.style.paddingTop = scope.messages.length ? angular.element('#user-messages').height() + 'px' : 0;
              }, 500);
            }
          }
        };

        var messagesUnWatch = $rootScope.$watch(
          function() {
            return userMessagesService.messages;
          },
          function() {
            scope.messages = userMessagesService.getMessages();
          }
        );

        scope.$on('$destroy', function() {
          messagesUnWatch();
        });
      }
    };
  }
]);
