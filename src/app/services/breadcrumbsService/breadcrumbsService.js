'use strict';

angular.module('mobiusApp.services.breadcrumbs', [])
  .service('breadcrumbsService', function(_, $rootScope) {

    var breadcrumbs = [];
    var hrefs = [];
    var activeHref;

    function clear() {
      breadcrumbs = [];
      hrefs = [];
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

    function removeHref(name) {
      var indexOfRemovedElement = _.findIndex(hrefs, {name: name});
      if(indexOfRemovedElement >= 0) {
        hrefs.splice(indexOfRemovedElement, 1);
      }
    }

    function setActiveHref(href) {
      activeHref = href;
      return object;
    }

    function getActiveHref() {
      return activeHref;
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
      removeHref: removeHref,
      setActiveHref: setActiveHref,
      getActiveHref: getActiveHref
    };

    return object;
  })
;
