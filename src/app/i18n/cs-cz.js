'use strict';

/*
 * This a module handling localization
 */
angular.module('mobius.i18n.languages')
  .config(function(languageTranslations) {
    languageTranslations['cs-cz'] = {
      'COMMON': {
        'PAGE_TITLE': 'Mobius Hotely',
        'HOME': 'Domů',
        'HOTELS': 'Hotely',
        'OFFERS_DEALS': 'Nabídky a Slevy',
        'ABOUT_US': 'O Nás',
        'NEWS': 'Novinky',
        'CONTACT': 'Kontakty',
        'LOGIN_REGISTER': 'Přihlásit / registrovat'
      }
    };
  })
;
