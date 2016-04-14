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
        if(!Settings.API.ecommerceDataLayer.active){
          return;
        }

        var n = document.createElement('noscript'); // use global document since Angular's $document is weak
        n.text = "<iframe src='//www.googletagmanager.com/ns.html?id=" + Settings.API.ecommerceDataLayer.id + " 'height='0' width='0' style='display:none;visibility:hidden'></iframe>";
        document.body.appendChild(n);

        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.text = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + Settings.API.ecommerceDataLayer.id + "');";
        document.body.appendChild(s);
      }
    };
  });
