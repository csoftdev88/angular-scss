'use strict';

angular.module('mobiusApp.directives.userMessages', [])

  .directive('userMessages', ['userMessagesService', '$controller', function(userMessagesService, $controller) {
    return {
      restrict: 'E',
      templateUrl: 'directives/userMessages/userMessages.html',

      // Widget logic goes here
      link: function(scope) {

        $controller('SanitizeCtrl', {$scope: scope});

        scope.closeMessage = function(index) {
          if (0 <= index && index < scope.messages.length) {
            scope.messages.splice(index, 1);
          }
        };

        var messagesUnWatch = scope.$watch(
          function() {
            return userMessagesService.messages;
          },
          function(messages) {
            scope.messages = messages;
          }
        );

        scope.$on('$destroy', function() {
          messagesUnWatch();
        });
      }
    };
  }]);
