/*
 *    (c) Copyright 2016 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  angular
    .module('horizon.app.resources.os-horizon')
    .factory('horizon.app.resources.os-horizon.server-side-action', serverSideAction);

  serverSideAction.$inject = [
    '$document',
    '$http',
    '$rootScope',
    '$q',
    '$timeout',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.app.core.openstack-service-api.server-side-action',
    'horizon.framework.util.actions.action-result.service'
  ];

  function serverSideAction(
    $document,
    $http,
    $rootScope,
    $q,
    $timeout,
    waitSpinner,
    serverSideActionApi,
    actionResultService)
  {
    var actionTypes = {
      UPDATE: "update",
      DELETE: "delete"
    };

    var service = {
      getAction: getAction,
      actionTypes: actionTypes
    };
    
    return service;
    
    /// PRIVATE

    /**
     *
     * @param actionName - Action "name". Passed to server side to uniquely identify the action. By convention
     *  this is the Python action's class name
     * @param resourceType (optional) - Type items the action operates upon. Example: "OS::Cinder::Volume"
     * @param actionType (required if resourceType) - what basic kind of action. Used to create an ActionResult even when server-side
     *  result is not communicated to the client. Supported options are
     *  - 'update' - this action will update the current item
     *  - 'delete' - this action will delete the current item
     * @param idAttributeName (required if resourceType) - The field that contains the "id" for item this action acts upon. Used to
     *  extract the resource ID from the data passed to the perform function
     * @returns {{initScope: initScope, allowed: allowed, perform: perform}}
     */
    function getAction(actionName, resourceType, actionType, idAttributeName) {
      var modal, performData, performDeferred;
      var deregisterOnLocationChange = angular.noop;
      var service = {
        initScope: initScope,
        allowed: allowed,
        perform: perform
      };

      return service;

      function initScope(newScope) {
        return;
      }

      function allowed(data) {
        return $q.when(true);
      }

      // TODO (tyr): block searchlight-ui polling while waiting for action completion?
      // otherwise SL might get the update before we return from the action, or perhaps
      // we need to cache the id BEFORE attempting the action?
      function perform(data) {
        // Remember the data being operated upon. Use this data to build the action result on success
        performData = data;
        
        // Because we use horizon.modal.js to view the action modal which does not have a promise associated
        // with it, create our own promise to return to the caller.
        performDeferred = $q.defer();
        
        // Show the wait spinner while loading the action modal HTML
        waitSpinner.showModalSpinner(gettext("Loading"));

        // TODO (tyr) - Is is possible to re-use horizon.modal.js '.ajax-modal' click handler somehow?
        //
        // Use the server side action service to load and display the action's modal. For Django generated pages,
        // each action link has a '.ajax-modal' class and a dynamically generated href specific to the resource.
        // Because this is a client-side action, we instead call the server side to generate that dynamic URL. We
        // then load that URL to get the action HTML. This HTML is then inserted into the page's existing modal div.
        //
        // Effectively, we use the "normal" Horizon action modal system...but need to customze the horizon.modal.js
        // .ajax-modal click handler.
        serverSideActionApi.perform(actionName, data).then(function (result) {
          return loadAction(result.data).then(function (result) {
            waitSpinner.hideModalSpinner();
            return displayAction(result.data);
          }, function errorCallback(response) {
            waitSpinner.hideModalSpinner();
            return performDeferred.reject(response);
          })
        });

        return performDeferred.promise;
      }

      /**
       *
       * @param actionUrl - URL of a server-side action
       * @returns $http promise for URL load
       */
      function loadAction(actionUrl) {
        return $http({
          method: 'GET',
          url: actionUrl
        });
      }

      /**
       * Given HTML representing a server-size action modal, insert it into the page using the
       * existing horizon.modal.js functions.
       *
       * @param html - HTML for server-side action
       */
      function displayAction(html) {
        // Listen for modal events caused by horizon.modal.js
        addModalEventListeners();

        // Parse the action's HTML then load it into a modal using horizon.modal.js
        html = $.parseHTML($.trim(html));
        $timeout(function() {
          // Must use $timeout to call modals.success OFF the angular digest cycle because
          // this method kicks of an Angular digest to compile any Angular content that may
          // be contained in the modal.
          horizon.modals.success(html);
        }, 0, false);
      }

      /**
       * For actions initiated client-side, listen for that action being closed, or any redirects (which
       * indicate action success).  These events are dispatched from the horizon.modals.js code.
       */
      function addModalEventListeners() {
        // Listen for location change events
        deregisterOnLocationChange = $rootScope.$on('$locationChangeStart', modalEventHandler);
        // Bind "cancel" button handler.
        $document.one('click', '.modal .cancel', modalEventHandler);
        // Bind "close" button handler
        $document.one('click', '.modal .close', modalEventHandler);
      }

      function removeModalEventListeners() {
        deregisterOnLocationChange();
        $document.off('click', '.modal .cancel', modalEventHandler);
        $document.off('click', '.modal .close', modalEventHandler);
      }

      function modalEventHandler(event) {
        // Unregister *all* listeners when we handle *any* event
        removeModalEventListeners();

        if ( event.name === '$locationChangeStart') {
          onLocationChange(event);
        } else {
          onModalCanceled(event);
        }
      }

      function onModalCanceled(event) {
        performDeferred.reject(gettext("Canceled"));
      }

      /**
       * Treat a redirect as action success.
       * @param event
       */
      function onLocationChange(event) {
        // prevent the redirect on modal success
        event.preventDefault();

        // TODO (tyr) Is this necessary
        if ( horizon.modals.spinner ) {
          // if horizon.modals.js doesn't redirect after an action, we must hide the spinner
          // ourselves
          horizon.modals.spinner.modal('hide');
        }

        performDeferred.resolve(onActionSuccess());
      }

      /**
       * Server side action has completed. Since server side actions don't return result data, make a best
       * guess about the ActionResult.
       * @returns ActionResult
       */
      function onActionSuccess() {
        var actionResult = actionResultService.getActionResult();

        if ( resourceType ) {
          // Get the id of the item being operated upon
          var id = performData[idAttributeName];
          if ( actionType == actionTypes.UPDATE ) {
            actionResult.updated(resourceType, id);
          } else if ( actionType == actionTypes.DELETE ) {
            actionResult.deleted(resourceType, id);
          }
        }

        return actionResult.result;
      }
    }
  }
})();
