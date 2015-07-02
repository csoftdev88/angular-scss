'use strict';

/*
 * Service for storing user UI preferences
 */
angular.module('mobiusApp.services.preference', [])
.service( 'preferenceService',  function() {
  // NOTE: Can be extended to localStorage
  var store = {};

  function get(key){
    return store[key];
  }

  function setDefault(key, value){
    if(store[key] === undefined){
      store[key] = value;
    }
  }

  function set(key, value){
    store[key] = value;
  }

  // Public methods
  return {
    get: get,
    set: set,
    setDefault: setDefault
  };
});
