'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http) {
  function get(url) {
    var q = $q.defer();

    $http({
      method: 'GET',
      url: url
    }).success(function(res) {
      q.resolve(res);

    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }


  function post(url, data) {
    var q = $q.defer();

    $http({
      method: 'POST',
      url: url,
      data: data
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }

  // Public methods
  return {
    get: get,
    post: post
  };
});
