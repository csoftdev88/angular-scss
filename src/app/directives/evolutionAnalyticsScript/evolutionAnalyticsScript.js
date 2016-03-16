'use strict';
/*jshint -W109 */

angular.module('mobiusApp.directives.evolutionAnalyticsScript', [])

  .directive('evolutionAnalyticsScript', function(Settings) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {
        if(!Settings.API.evolutionAnalytics.enable){
          return;
        }
        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.text = "!function(n,t,e,i,o,a,s,c,r){n.InfinitiObject=o,n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)},n[o].a=c,r=new Date,r=[r.getUTCFullYear(),r.getMonth(),r.getUTCDay(),r.getHours()%3||3].join(''),a=t.createElement(e),s=t.getElementsByTagName(e)[0],a.async=1,a.src=i+'?ts='+r,s.parentNode.insertBefore(a,s)}(window,document,'script','https://storage.googleapis.com/infiniti-evolution/infiniti.evolution.js','evolution');" +
          "evolution('create', '" + Settings.API.evolutionAnalytics.id + "');";
        document.head.appendChild(s);
      }
    };
  });
