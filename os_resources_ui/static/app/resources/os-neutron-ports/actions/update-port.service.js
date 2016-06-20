/**
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function () {
  'use strict';

  angular
    .module('horizon.app.resources.os-neutron-nets.actions')
    .factory('horizon.app.resources.os-neutron-ports.actions.updatePort', service);

  service.$inject = [
    'horizon.app.resources.os-horizon.server-side-action',
    'horizon.app.resources.os-neutron-ports.resourceType'
  ];

  function service(serverSideActionService, resourceTypeName) {

    var serverSideAction = serverSideActionService.getAction(
      'UpdatePort',
      resourceTypeName,
      serverSideActionService.actionTypes.UPDATE,
      'id');

    var service = {
      initScope: initScope,
      allowed: allowed,
      perform: perform
    };

    return service;

    function initScope(newScope) {
      return serverSideAction.initScope(newScope);
    }

    function allowed(data) {
      return serverSideAction.allowed(data);
    }

    function perform(data) {
      return serverSideAction.perform(data);
    }
  }
})();
