'use strict';

angular.module('mobiusApp.services.breadcrumbs', [])
  .service('breadcrumbsService', function(_, $rootScope,
      scrollService) {

    var breadcrumbs = [];
    var hrefs = [];
    var absHrefs = [];
    var activeHref;

    function clear() {
      breadcrumbs = [];
      hrefs = [];
      absHrefs = [];
      $rootScope.showHomeBreadCrumb = true;
      return object;
    }

    function getBreadCrumbs() {
      return breadcrumbs;
    }

    function setBreadCrumbs(newBreadcrumbs) {
      breadcrumbs = newBreadcrumbs;
      return object;
    }

    function addBreadCrumb(name, stateName, stateParams, hash) {
      breadcrumbs.push({
        state: stateName,
        params: stateParams,
        name: name,
        hash: hash
      });
      return object;
    }

    function getHrefs() {
      return hrefs;
    }

    function setHrefs(newHrefs) {
      hrefs = newHrefs;
      return object;
    }

    function addHref(name, href) {
      hrefs.push({
        id: href,
        name: name
      });
      return object;
    }

    function getAbsHrefs() {
      return absHrefs;
    }

    function addAbsHref(name, stateName, stateParams) {
      absHrefs.push({
        state: stateName,
        params: stateParams,
        name: name
      });
      return object;
    }

    function removeHref(name) {
      var indexOfRemovedElement = _.findIndex(hrefs, {name: name});
      if(indexOfRemovedElement >= 0) {
        hrefs.splice(indexOfRemovedElement, 1);
      }
    }

    // TODO: This seems to be redundant
    function setActiveHref(href) {
      activeHref = href;
      return object;
    }

    function getActiveHref() {
      return activeHref;
    }

    // Return visible href in viewport
    function getViewportHref(){
      if(hrefs && hrefs.length){
        // Getting positions
        var positions = _.compact(hrefs.map(function(href){
          var top = getHrefPosition(href);
          // NOTE - interested in only real positions
          if(top){
            return {
              href: href,
              top: top
            };
          }else{
            return null;
          }
        }));

        // Sorting by positions
        positions = _.sortBy(positions, function(pos){
          return pos.top;
        });

        if(positions.length){
          var viewPortOffset = scrollService.getScrollTop();
          for(var i = positions.length-1; i >=0; i--){
            var pos = positions[i];
            if(pos.top - scrollService.getHeaderHeight(true) < viewPortOffset){
              return pos.href;
            }
          }

          // NOTE: Returning first href
          return positions[0].href;
        }
      }

      return null;
    }

    function getHrefPosition(href){
      var hrefElement = angular.element('#' + href.id);
      if(hrefElement.length){
        return hrefElement.offset().top;
      }

      return 0;
    }

    // Public methods
    var object = {
      clear: clear,
      getBreadCrumbs: getBreadCrumbs,
      setBreadCrumbs: setBreadCrumbs,
      addBreadCrumb: addBreadCrumb,
      getHrefs: getHrefs,
      setHrefs: setHrefs,
      addHref: addHref,
      addAbsHref: addAbsHref,
      getAbsHrefs: getAbsHrefs,
      removeHref: removeHref,
      setActiveHref: setActiveHref,
      getActiveHref: getActiveHref,
      getViewportHref: getViewportHref
    };

    return object;
  })
;
