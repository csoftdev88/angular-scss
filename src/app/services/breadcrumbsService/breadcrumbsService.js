'use strict';

angular.module('mobiusApp.services.breadcrumbs', [])
  .service('breadcrumbsService', function() {

    var breadcrumbs = [];
    var hrefs = [];
    var activeHref;

    function clear() {
      breadcrumbs = [];
      hrefs = [];
      return object;
    }

    function getBreadCrumbs() {
      return breadcrumbs;
    }

    function setBreadCrumbs(newBreadcrumbs) {
      breadcrumbs = newBreadcrumbs;
      return object;
    }

    function addBreadCrumb(name, stateName, stateParams) {
      breadcrumbs.push({
        state: stateName,
        params: stateParams,
        name: name
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
      setActiveHref: setActiveHref,
      getActiveHref: getActiveHref
    };

    return object;
  })
;
