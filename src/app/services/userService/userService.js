'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function($rootScope, $q, $window, $state,
    userObject, apiService, _, loyaltyService, cookieFactory, dataLayerService, rewardsService, Settings, $timeout, stateService, $log) {

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = Settings.authType === 'mobius' ? 'mobius-authentication' : 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = Settings.authType === 'mobius' ? 'mobius-authentication' : 'infinitiAuthN';
    if (Settings.authType === 'keystone') {
      HEADER_INFINITI_SSO = 'keystone-authentication';
    }

    var EVENT_CUSTOMER_LOADED = 'infiniti.customer.loaded';
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';

    // TODO Implement this with AuthCtrl
    var EVENT_ANONYMOUS_LOADED = 'infiniti.anonymous.loaded';

    if (Settings.authType === 'keystone') {
      EVENT_CUSTOMER_LOADED = 'keystone.session.created';
      EVENT_CUSTOMER_LOGGED_OUT = 'keystone.session.destroyed';
      EVENT_ANONYMOUS_LOADED = 'keystone.session.anonymous';
    }

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;

    cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function hasSSOCookies(){
      //console.log('hasSSOCookies: ' + cookieFactory(KEY_CUSTOMER_PROFILE));
      return Settings.authType === 'mobius' ? true : !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function getCustomerId(){
      if (Settings.authType === 'keystone') {
        return (keystoneIsAuthenticated() && window.KS.$me.get().MobiusId) ? window.KS.$me.get().MobiusId : null;
      }
      if(!hasSSOCookies()){
        return null;
      }

      if(Settings.authType === 'mobius'){
        return userObject.id || getStoredUser().id;
      }
      else{
        return userObject.id || cookieFactory(KEY_CUSTOMER_ID);
      }

    }

    function updateUser(data) {
      var customerId = getCustomerId();

      if (customerId) {
        if (Settings.authType === 'keystone') {
          window.KS.$me.update(data).then(function(updatedUser) {
            userObject = updatedUser;
          });
        } else {
          return apiService.put(
            apiService.getFullURL('customers.customer', {customerId: customerId}), data)
            .then(function() {
              userObject = _.extend(userObject, data);
            });
        }
      } else {
        throw new Error('No user logged in');
      }
    }

    function storeUserId(id) {
      $window.document.cookie = 'MobiusId' + '=' + id + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
    }

    function getStoredUser() {
      var data;
      if (Settings.authType === 'keystone') {
        data = {
          id: getCustomerId(),
          token: cookieFactory('KS_MT') ? cookieFactory('KS_MT').replace(/%22/g, '') : null
        };
      } else {
        data = {
          id: cookieFactory('MobiusId'),
          token: cookieFactory('MobiusToken')
        };
      }
      return data;
    }

    function clearStoredUser() {
      $window.document.cookie = 'MobiusId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'MobiusToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'CustomerID=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    function storeUserLanguage(lang) {
      $window.document.cookie = 'MobiusLanguageCode=' + lang + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.languageCode = lang;
      if (Settings.authType === 'keystone' && window.KS.$me && keystoneIsAuthenticated()) {
        $log.info('changing the lang for the user to', lang);
        window.KS.$me.update({
          Language: lang
        })
        .then(function(updatedUser) {
          userObject = updatedUser;
        });
      }
    }

    function getUserLanguage() {
      if (Settings.authType === 'keystone' && keystoneIsAuthenticated()) {
        return window.KS.$me.get().Language || 'en';
      } else {
        return cookieFactory('MobiusLanguageCode');
      }
    }

    function storeUserCurrency(currency) {
      $window.document.cookie = 'MobiusCurrencyCode' + '=' + currency + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.currencyCode = currency;
      if (Settings.authType === 'keystone' && keystoneIsAuthenticated()) {
        window.KS.$me.update({
          Currency: currency
        })
          .then(function(updatedUser) {
            userObject = updatedUser;
          });
      }
    }

    function getUserCurrency() {
      if (Settings.authType === 'keystone') {
        if (keystoneIsAuthenticated()) {
          return window.KS.$me.get().Currency || Settings.UI.currencies.default.code;
        }
      }
      return cookieFactory('MobiusCurrencyCode') || Settings.UI.currencies.default.code;
    }

    function loadProfile() {
      if (Settings.authType === 'keystone') {
        if (!keystoneIsAuthenticated()) {
          return authPromise.resolve(false);
        }

        return loadLoyalties(getCustomerId()).then(function() {
          return loadRewards(getCustomerId());
        })
          .then(function() {

            userObject = mapKeystoneUserToMobiusUser(window.KS.$me.get());

            var headers = {};
            headers[HEADER_INFINITI_SSO] = getStoredUser().token;
            apiService.setHeaders(headers);

            return authPromise.resolve(true);

          });
      } else {
        var customerId = getCustomerId();

        //We need token to load mobius profile
        if(Settings.authType === 'mobius' && !(userObject.token || getStoredUser().token)){
          // Logged in as anonymous
          if(authPromise){
            authPromise.resolve(false);
          }
          return;
        }

        if(customerId){
          // Setting up the headers for a future requests
          var headers = {};
          headers[HEADER_INFINITI_SSO] = Settings.authType === 'mobius' ? userObject.token || getStoredUser().token : cookieFactory(KEY_CUSTOMER_PROFILE);
          apiService.setHeaders(headers);

          // Loading profile data and users loyelties
          return $q.all([
            apiService.get(apiService.getFullURL('customers.customer', {customerId: customerId})),
            loadLoyalties(customerId), loadRewards(customerId)
          ]).then(function(data){
            var userData = data[0];

            // NOTE: data[0] is userProfile data
            // data[1] is loyalties data - handled in loadLoyalties function
            if(userData && _.isArray(userData.email) &&  userData.email.length){
              // Multiple email are not needed - we picking the first one
              userData.email =  userData.email[0].value;
              // Updating user details in data layer
              dataLayerService.setUserId(customerId);
            }

            userObject = _.extend(userObject, userData);
            userObject.avatarUrl = userObject.avatar && userObject.avatarUrl ? userObject.avatarUrl : '/static/images/v4/img-profile.png';
            userObject.languageCode = getUserLanguage() || stateService.getAppLanguageCode();

            // Logged in as mobius user
            if(Settings.authType === 'mobius'){
              $timeout(function(){
                $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
              });
            }


            if(authPromise && authPromise.resolve){
              authPromise.resolve(true);
            }

          }, function(){
            if(Settings.authType === 'mobius'){
              clearStoredUser();
            }
          });
        } else {
          //If for whatever reason we do not have a customerId, clear the stored user and reject the auth
          clearStoredUser();
          return $q.reject({});
        }
      }
    }

    function loadLoyalties(customerId){

      if(!Settings.loyaltyProgramEnabled){
        return $q.when();
      }

      customerId = customerId || getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        if(loyalties && loyalties.amount === undefined){
          loyalties.amount = 0;
        }

        userObject.loyalties = loyalties;

        return loyalties;
      });
    }

    function loadRewards(customerId){

      if(!Settings.loyaltyProgramEnabled){
        return;
      }

      customerId = customerId || getCustomerId();

      return rewardsService.getMy(customerId).then(function(rewards){
        userObject.rewards = rewards;

        return rewards;
      });
    }

    function logout() {

      if (! window.KS.$me) {
        $rootScope.$evalAsync(function(){
          userObject = {};
          $state.go('home', {}, {reload: true});
        });

        // Removing auth headers
        var headers = {};
        headers[HEADER_INFINITI_SSO] = undefined;
        apiService.setHeaders(headers);

        clearStoredUser();

        authPromise = $q.defer();

        if(Settings.authType === 'mobius'){
          $timeout(function(){
            $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
          });
        }
      }
    }

    function initSSOListeners(){
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

      $window.addEventListener(
        EVENT_ANONYMOUS_LOADED,
      function(){
        // Logged in as anonymous
        if(authPromise){
          authPromise.resolve(false);
        }
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

    if(Settings.authType === 'infiniti' || Settings.authType === 'keystone'){
      initSSOListeners();
    }
    else{
      loadProfile();
    }

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

    function mapKeystoneTitleToId(title) {
      switch (title) {
        case 'Mr':
          return 1;
        case 'Mrs':
          return 2;
        case 'Miss':
          return 3;
        case 'Ms':
          return 4;
        case 'Master':
          return 5;
        case 'Dr':
          return 6;
        case 'Prof':
          return 7;
        case 'Rev':
          return 8;
        case 'Other':
          return 9;
        default:
          return null;
      }
    }

    function mapKeystoneUserToMobiusUser(ksUser) {

      if (ksUser === null) {
        return emptyUser;
      }

      return {
        id:           ksUser.MobiusId || null,
        title:        mapKeystoneTitleToId(ksUser.Name.Title),
        firstName:    ksUser.Name.FirstName || null,
        lastName:     ksUser.Name.LastName || null,
        email:        (ksUser.Email[0]) ? ksUser.Email[0].Email : null,
        address1:     (ksUser.Address[0]) ? ksUser.Address[0].FirstLine : null,
        city:         (ksUser.Address[0]) ? ksUser.Address[0].City      : null,
        zip:          (ksUser.Address[0]) ? ksUser.Address[0].Postcode  : null,
        state:        (ksUser.Address[0]) ? ksUser.Address[0].County    : null,
        country:      (ksUser.Address[0]) ? ksUser.Address[0].Country   : null,
        localeCode:   (ksUser.Address[0]) ? ksUser.Address[0].Country   : null,
        languageCode: ksUser.Language || null,
        currencyCode: ksUser.Currency || null,
        tel1:         (ksUser.Phone[0]) ? ksUser.Phone[0].Number : null,
        tel2:         (ksUser.Phone[1]) ? ksUser.Phone[1].Number : null,
        optedIn:      ksUser.OptIn,
        avatarUrl:    (ksUser.Avatar[0]) ? ksUser.Avatar[0].ImagePath : '/static/images/v4/img-profile.png'
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
  });
