'use strict';
/*jshint -W109 */

angular.module('mobiusApp.directives.googleTagManagerScript', [])

  .directive('googleTagManagerScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {
        var env = document.querySelector('meta[name=environment]').getAttribute('content');
        if(!Settings.googleTagManager.enable){
          return;
        }

        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.text = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + Settings.googleTagManager.id + "');";
        document.body.insertBefore(s, document.body.firstChild);

        var n = document.createElement('noscript'); // use global document since Angular's $document is weak
        n.text = "<iframe src='//www.googletagmanager.com/ns.html?id=" + Settings.googleTagManager.id + " 'height='0' width='0' style='display:none;visibility:hidden'></iframe>";
        document.body.insertBefore(n, document.body.firstChild);


      }
    };
  });
