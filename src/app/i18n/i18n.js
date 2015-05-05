'use strict';
/*
 * This a module handling localization
 */
angular.module('mobius.i18n', ['mobius.i18n.languages'])
  .config(function($translateProvider, Settings, languageTranslations) {
    var languages = Object.keys(Settings.UI.languages);

    languages.forEach(function(language) {
      $translateProvider.translations(language, languageTranslations[language] || {});
    });
    $translateProvider.useSanitizeValueStrategy('escaped');
  })

  .run(function($translate, $rootScope, Settings, _) {
    var languages = Object.keys(Settings.UI.languages);

    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState, fromParams) {
      if (!nextParams.language) {
        nextParams.language = fromParams.language;
      }
      if (!nextParams.language || !_.contains(languages, nextParams.language)) {
        nextParams.language = languages[0];
      }

      if ($rootScope.language_code !== nextParams.language) {
        $translate.use(nextParams.language);
        $rootScope.language_code = nextParams.language;
        $rootScope.language = Settings.UI.languages[nextParams.language] ? Settings.UI.languages[nextParams.language].shortName : '';
      }
    });
  })
;
