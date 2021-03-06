/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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

  /* eslint-disable max-len */
  /**
   * @ngdoc overview
   * @name horizon.app.resources.os-swift-container.actions
   * @description
   *
   * # horizon.app.resources.os-swift-container.actions
   *
   * This module provides actions for Neutron Ports
   */
  angular.module('horizon.app.resources.os-swift-container.actions', [
  ])
    .run(registerActions);

  registerActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.resources.os-horizon.server-side-action',
    'horizon.app.resources.os-swift-container.resourceType'
  ];
  
  function registerActions(
    registry,
    serverSideActionService,
    resourceTypeName) {
    var resourceType = registry.getResourceType(resourceTypeName);
    var serverSideAction = serverSideActionService.getAction('CreateContainer');
    resourceType.globalActions
      .append({
        id: 'createContainer',
        service: serverSideAction,
        template: {
          text: gettext('Create Container')
        }
      });
  }
})();
