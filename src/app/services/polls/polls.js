'use strict';

/**
 * Service to interact with the polls endpoints
 *
 * @see apiService
 */
(function() {

  angular
    .module('mobiusApp.services.polls', [])
    .service('polls', ['apiService', '$log', 'stateService', Polls]);

  function Polls(apiService, $log, stateService) {

    var self = this;

    var _deviceId = stateService.isMobile() ? 6 : 1;

    self.get = function (id) {
      return apiService.get(
        apiService.getFullURL('contents.polls.index', { pollId: id }),
        { deviceId: _deviceId }
      ).then(function (data) {
        return data;
      }, function (err) {
        $log.warn('API error: Could not get poll', err);
      });
    };

    self.getAll = function () {
      return apiService.get(
        apiService.getFullURL('contents.polls.all'),
        { deviceId: _deviceId }
      ).then(function (data) {
        return data;
      }, function (err) {
        $log.warn('API error: Could not get all polls', err);
      });
    };

    self.answer = function (id, choice) {
      return apiService.post(
        apiService.getFullURL('contents.polls.answer', { pollId: id }),
        {
          choiceId: choice,
          deviceId: _deviceId
        }
      ).then(function (data) {
        return data;
      }, function (err) {
        $log.warn('API error: Could not post to poll', err);
      });
    };


  }

}());
