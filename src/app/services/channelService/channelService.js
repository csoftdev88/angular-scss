'use strict';
/*
 * This service gets the current channel
 */
angular.module('mobiusApp.services.channelService', [])
  .service('channelService', function(_, Settings, stateService, $location, $window, cookieFactory) {

    function getChannel() {
      //If our querystring contains the param ch=me then select the channelId for meta
      if ($location.search().ch && $location.search().ch === 'me') {
        //Store the channel ID in a session cookie and then return the channel
        var cookieName = Settings.API.sessionData.channelIdCookie;
        var metaChannel = _.find(Settings.API.headers['Mobius-channelId'], function(channel) {
          return channel.name === 'meta';
        });
        $window.document.cookie = cookieName + '=' + metaChannel.channelID + '; path=/';
        return metaChannel;
      }
      //Check if we have a channel already defined in ChannelId cookie for the session
      var channelCookie = cookieFactory(Settings.API.sessionData.channelIdCookie);
      if (channelCookie) {
        return _.find(Settings.API.headers['Mobius-channelId'], function(channel) {
          return channel.channelID === parseInt(channelCookie);
        });
      }
      //If not and if we are in mobile view, return the id for mobile
      else if (stateService.isMobileDevice()) {
        return _.find(Settings.API.headers['Mobius-channelId'], function(channel) {
          return channel.name === 'mobileWeb';
        });
      }
      //Otherwise return the id for desktop
      else {
        return _.find(Settings.API.headers['Mobius-channelId'], function(channel) {
          return channel.name === 'web';
        });
      }
    }

    // Public methods
    return {
      getChannel: getChannel
    };
  });
