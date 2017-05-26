(function() {
  'use strict';

  angular
    .module('mobiusApp.services.user', [])
    .service('keystoneUserStrategy', KeystoneUserStrategy);

  KeystoneUserStrategy.$inject = ['$q', '$window', '$state', 'userObject', 'apiService', 'loyaltyService',
                                  'cookieFactory', 'rewardsService', 'Settings'];

  function KeystoneUserStrategy($q, $window, $state, userObject, apiService, loyaltyService, cookieFactory,
                                rewardsService, Settings) {

    var AUTH_HEADER = 'keystone-authentication';

    var EVENT_CUSTOMER_LOADED = 'keystone.session.created';
    var EVENT_CUSTOMER_LOGGED_OUT = 'keystone.session.destroyed';

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;

    cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function getCustomerId() {
      return (keystoneIsAuthenticated() && window.KS.$me.get().MobiusId) ? window.KS.$me.get().MobiusId : null;
    }

    function updateUser(data) {
      var customerId = getCustomerId();

      if (customerId) {
        window.KS.$me.update(data).then(function(updatedUser) {
          userObject = updatedUser;
        });
      } else {
        throw new Error('No user logged in');
      }
    }

    function storeUserId(id) {
      $window.document.cookie = 'MobiusId' + '=' + id + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
    }

    function getStoredUser() {
      return {
        id: getCustomerId(),
        token: cookieFactory('KS_MT')
      };
    }

    function clearStoredUser() {
      $window.document.cookie = 'MobiusId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'MobiusToken' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'CustomerID' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    function storeUserLanguage(lang) {
      $window.document.cookie = 'MobiusLanguageCode' + '=' + lang + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.languageCode = lang;
      window.KS.$me
        .update({
          Language: lang
        })
        .then(function(updatedUser) {
          userObject = updatedUser;
        });
    }

    function getUserLanguage() {
      if (keystoneIsAuthenticated()) {
        return window.KS.$me.get().Language;
      }
      return 'en';
    }

    function storeUserCurrency(currency) {
      $window.document.cookie = 'MobiusCurrencyCode' + '=' + currency + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.currencyCode = currency;
      window.KS.$me
        .update({
          Currency: currency
        })
        .then(function(updatedUser) {
          userObject = updatedUser;
        });
    }

    function getUserCurrency() {
      if (keystoneIsAuthenticated()) {
        return window.KS.$me.get().Currency;
      }
      return 'CAD';
    }

    function loadProfile() {
      if (!keystoneIsAuthenticated()) {
        return authPromise.reject('no user');
      }

      return loadLoyalties(getCustomerId())
        .then(function() {
          return loadRewards(getCustomerId());
        })
        .then(function() {
          userObject = mapKeystoneUserToMobiusUser(window.KS.$me.get());
          var headers = {};
          headers[AUTH_HEADER] = getStoredUser().token;
          apiService.setHeaders(headers);

          return authPromise.resolve(true);
        });
    }

    function loadLoyalties(customerId){

      if(!Settings.loyaltyProgramEnabled){
        return $q.when();
      }

      customerId = customerId || getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        if (loyalties && loyalties.amount === undefined) {
          loyalties.amount = 0;
        }
        userObject.loyalties = loyalties;
        return loyalties;
      });
    }

    function loadRewards(customerId) {
      if (!Settings.loyaltyProgramEnabled) {
        return;
      }
      customerId = customerId || getCustomerId();

      return rewardsService.getMy(customerId).then(function(rewards){
        userObject.rewards = rewards;
        return rewards;
      });
    }

    function logout() {
      if (window.KS.$me) {
        window.KS.$me
          .revoke()
          .then(function() {
            $state.go('home', {});
          });
      }
    }

    function initSSOListeners() {
      // SSO event listeners
      $window.addEventListener(
        EVENT_CUSTOMER_LOADED,
        function(){
          loadProfile();
        });

      $window.addEventListener(
        EVENT_CUSTOMER_LOGGED_OUT,
        function(){
          logout();
        });
    }

    function keystoneIsAuthenticated() {
      return (window.KS && window.KS.$me && window.KS.$me.get() !== null);
    }

    function getUser () {
      if(Settings.authType === 'keystone') {
        if (keystoneIsAuthenticated()) {
          return mapKeystoneUserToMobiusUser(window.KS.$me.get());
        }
        return emptyUser;
      }
      return userObject;
    }

    function init() {
      initSSOListeners();
    }

    init();

    var emptyUser = {
      id:           null,
      title:        null,
      firstName:    null,
      lastName:     null,
      email:        null,
      address1:     null,
      city:         null,
      zip:          null,
      state:        null,
      country:      null,
      currencyCode: null,
      languageCode: null,
      tel1:         null,
      tel2:         null,
      optedIn:      null,
      avatarUrl:    null,
    };

    function mapKeystoneUserToMobiusUser(ksUser) {

      if (ksUser === null) {
        return emptyUser;
      }

      return {
        id:           ksUser.MobiusId || null,
        title:        ksUser.Name.Title || null,
        firstName:    ksUser.Name.FirstName || null,
        lastName:     ksUser.Name.LastName || null,
        email:        (ksUser.Email[0]) ? ksUser.Email[0].Email : null,
        address1:     (ksUser.Address[0]) ? ksUser.Address[0].FirstLine : null,
        city:         (ksUser.Address[0]) ? ksUser.Address[0].City      : null,
        zip:          (ksUser.Address[0]) ? ksUser.Address[0].Postcode  : null,
        state:        (ksUser.Address[0]) ? ksUser.Address[0].County    : null,
        country:      (ksUser.Address[0]) ? ksUser.Address[0].Country   : null,
        languageCode: ksUser.Language || null,
        currencyCode: ksUser.Currency || null,
        tel1:         (ksUser.Phone[0]) ? ksUser.Phone[0].Number : null,
        tel2:         (ksUser.Phone[1]) ? ksUser.Phone[1].Number : null,
        optedIn:      ksUser.OptIn,
        avatarUrl:    (ksUser.Avatar[0]) ? ksUser.Avatar[0].ImagePath : 'http://profile.ak.fbcdn.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif'
      };
    }

    return {
      isLoggedIn: function() {
        return keystoneIsAuthenticated();
      },
      getProfileUrl: function() {
        return (keystoneIsAuthenticated()) ? window.KS.$url.PROFILE : '#';
      },
      isKeystoneActive: function () {
        return Settings.authType === 'keystone';
      },
      openLogin: function() {
        window.KS.$event.emit(window.KS.$event.const.PARENT_REQUEST_LOGIN);
      },
      getUser: getUser,
      loadProfile: loadProfile,
      getCustomerId: getCustomerId,
      loadLoyalties: loadLoyalties,
      loadRewards: loadRewards,
      updateUser: updateUser,
      authPromise: authPromise.promise,
      storeUserLanguage: storeUserLanguage,
      getUserLanguage: getUserLanguage,
      storeUserId: storeUserId,
      getStoredUser: getStoredUser,
      clearStoredUser: clearStoredUser,
      storeUserCurrency: storeUserCurrency,
      getUserCurrency: getUserCurrency
    };
  }

}());
