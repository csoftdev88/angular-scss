/*globals Raven */

/**
 * Function ran after the config has been set but before controller initialisation.
 *
 * Its main responsibility is to set global variables and listeners on state change
 */
(function () {
  "use strict";

  angular
    .module('mobiusApp')
    .run(Bootstrap);

  function Bootstrap(user, $rootScope, $state, breadcrumbsService, stateService, apiService, $window, $location,
                     Settings, propertyService, track404sService, sessionDataService, infinitiApeironService, _) {

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if(next.name === 'unknown'){ //If the page we are navigating to is not recognised
        if(Settings.API.track404s && Settings.API.track404s.enable) {  //This segment tracks any 404s and sends to our 404 tracking service
          var fromPath = null;
          if($location.search() && $location.search().fromDomain) {
            fromPath = $location.search().fromDomain;
          }
          track404sService.track($location.host(), $location.path(), fromPath ? fromPath : null);
        }
        //This variable is used to tell prerender.io that this page is a 404
        $rootScope.prerenderStatusCode = '404';
      } else if (next.parent === 'reservation' || next.name === 'reservationDetail' || next.name === 'reservations') {
        //Otherwise if page is recognised and the page is in the reservation flow or is /reservations, set the status code to 403
        $rootScope.prerenderStatusCode = '403';
      } else { //Otherwise set as 200 ok
        $rootScope.prerenderStatusCode = '200';
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $state.fromState = fromState;
      $state.fromParams = fromParams;
      breadcrumbsService.clear();

      $rootScope.requestId = sessionDataService.generateUUID();
      apiService.trackUsage($location.absUrl(), $rootScope.requestId);
      if(infinitiApeironService.isSinglePageApp){
        infinitiApeironService.trackPageView($location.path() + $window.location.search);
      }
    });
    //Facebook
    $rootScope.facebookAppId = Settings.UI.generics.facebookAppId;
    //Sentry
    if ($window.Raven && Settings.sentry.enable) {
      var env = document.querySelector('meta[name=environment]').getAttribute('content');
      Raven.config(Settings.sentry[env]).install();
    }

    if(Settings.inputValidationPattern)
    {
      $rootScope.generalValidationPattern = Settings.inputValidationPattern;
    }

    function encodeQueryData(data) {
      var ret = [];
      for (var d in data) {
        if (data.hasOwnProperty(d)) {
          ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
      }
      return ret.join('&');
    }

    var userLang = user.getUserLanguage();
    var appLang = stateService.getAppLanguageCode();

    if (userLang && userLang !== appLang && Settings.UI.languages[userLang]) {
      var language_code = userLang;
      //Only make this change if the new language code isn't default
      if(Settings.UI.languages.default !== language_code){
        var path = $location.path();
        var search = encodeQueryData($location.search());
        var hash = $location.hash();
        $window.location.replace((language_code ? '/' + language_code : '') + path + (search ? '?' + search : '') + (hash ? '#' + hash : ''));
      }
    }

    //Set default language header
    var langObj = {};
    langObj['mobius-languagecode'] = appLang;
    apiService.setHeaders(langObj);

    //Set default currency header
    var currencyObj = {};
    currencyObj['mobius-currencycode'] = stateService.getCurrentCurrency().code;
    apiService.setHeaders(currencyObj);

    //localize moment.js
    $window.moment.locale(appLang);

    //Let's get property slug if single property and save it to settings for future use
    if (Settings.UI.generics.singleProperty && Settings.UI.generics.defaultPropertyCode) {
      if (!Settings.API.propertySlug) {
        propertyService.getAll().then(function(properties) {
          var singleProperty = _.find(properties, function(property){
            return property.code === Settings.UI.generics.defaultPropertyCode;
          });
          if(singleProperty && singleProperty.code){
            propertyService.getPropertyDetails(singleProperty.code).then(function(details) {
              var slug = details.meta.slug;
              Settings.API.propertySlug = slug;
              $rootScope.propertySlug = slug;
            });
          }
        });
      }
    }
  }
}());
