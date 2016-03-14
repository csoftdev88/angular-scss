'use strict';
/*jshint -W109 */

angular.module('mobiusApp.directives.googleAnalyticsScript', [])

  .directive('googleAnalyticsScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {
        if(!Settings.API.appendGoogleAnalyticsScriptToPage){
          return;
        }
        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.text = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');" +
          "ga('create', '" + Settings.API.GoogleAnalyticsID + "', 'auto');" +
          "ga('send', 'pageview');";
        document.head.appendChild(s);
      }
    };
  });
