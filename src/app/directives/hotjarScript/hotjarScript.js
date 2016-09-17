'use strict';
/*jshint -W109 */

angular.module('mobiusApp.directives.hotjarScript', [])

.directive('hotjarScript', function(Settings) {
  return {
    restrict: 'E',
    scope: {},
    template: '',

    // Widget logic goes here
    link: function() {
      if (!Settings.hotjar.enable) {
        return;
      }
      var s = document.createElement('script'); // use global document since Angular's $document is weak
      s.text = "(function(h, o, t, j, a, r) {h.hj = h.hj || function() {(h.hj.q = h.hj.q || []).push(arguments)};h._hjSettings = {hjid:" + Settings.hotjar.id + ",hjsv: 5};a = o.getElementsByTagName('head')[0];r = o.createElement('script');r.async = 1;r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;a.appendChild(r);})(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');";
      document.head.appendChild(s);
    }
  };
});
