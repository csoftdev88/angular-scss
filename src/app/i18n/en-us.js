'use strict';
/*
 * This a module handling localization
 */
angular.module('mobius.i18n.languages')
  .config(function(languageTranslations) {
    languageTranslations['en-us'] = {
      'COMMON': {
        'PAGE_TITLE': 'Mobius Hotels',
        'HOME': 'Home',
        'HOTELS': 'Hotels',
        'OFFERS_DEALS': 'Offers & Deals',
        'ABOUT_US': 'About Us',
        'NEWS': 'News',
        'CONTACT': 'Contact',
        'LOGIN_REGISTER': 'Log In / Register'
      }
    };
  })
;
