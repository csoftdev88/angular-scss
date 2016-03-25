'use strict';
/*jshint -W109 */
//TODO: rename this as it isn't analytics but the new infiniti script
angular.module('mobiusApp.directives.evolutionAnalyticsScript', [])

  .directive('evolutionAnalyticsScript', function(Settings, $location) {
    return {
      restrict: 'E',
      scope: {},
      template: '',

      // Widget logic goes here
      link: function() {

        if(!Settings.API.evolutionAnalytics.enable){
          return;
        }

        var script = $location.host() === Settings.productionHost ? Settings.API.evolutionAnalytics.prodScriptUrl : Settings.API.evolutionAnalytics.devScriptUrl;
        var prestigeUrl = $location.host() === Settings.productionHost ? Settings.API.evolutionAnalytics.prodPrestigeUrl : Settings.API.evolutionAnalytics.devPrestigeUrl;

        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.text = "!function(n,t,e,i,o,a,s,c,r){n.InfinitiObject=o,n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)},n[o].a=c,r=new Date,r=[r.getUTCFullYear(),r.getMonth(),r.getUTCDay(),r.getHours()%3||3].join(''),a=t.createElement(e),s=t.getElementsByTagName(e)[0],a.async=1,a.src=i+'?ts='+r,s.parentNode.insertBefore(a,s)}(window,document,'script','" + script  + "','evolution');" +
          "evolution('create', '" + Settings.API.evolutionAnalytics.id + "');" +
          "evolution('sso.api', '" + prestigeUrl + "');";
        document.head.appendChild(s);
      }
    };
  });
