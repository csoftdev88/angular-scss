'use strict';
/*
 * This service gets the current channel
 */
angular.module('mobiusApp.services.channelService', [])
  .service( 'channelService',  function(_, Settings, stateService) {

    function getChannel(){
      if(stateService.isMobile())
      {
        return _.find(Settings.API.headers['Mobius-channelId'], function(channel){ return channel.name === 'mobile'; });
      }
      else {
        return _.find(Settings.API.headers['Mobius-channelId'], function(channel){ return channel.name === 'web'; });
      }
    }

    // Public methods
    return {
      getChannel: getChannel
    };
  });
