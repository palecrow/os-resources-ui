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
   * @name horizon.app.resources.os-neutron-nets.actions
   * @description
   *
   * # horizon.app.resources.os-neutron-nets.actions
   *
   * This module provides actions for Neutron Ports
   */
  angular.module('horizon.app.resources.os-neutron-nets.actions', [
  ])
    .run(registerActions);

  registerActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.resources.os-horizon-django.actions.service',
    'horizon.app.resources.os-neutron-nets.actions.createSubnet',
    'horizon.app.resources.os-neutron-nets.actions.createPort',
    'horizon.app.resources.os-neutron-nets.resourceType'
  ];
  
  function registerActions(
    registry,
    djangoActionService,
    createSubnet,
    createPort,
    resourceTypeName) {
    var resourceType = registry.getResourceType(resourceTypeName);
    var djangoAction = djangoActionService.getAction('CreateNetwork');
    resourceType.globalActions
      .append({
        id: 'createNetwork',
        service: djangoAction,
        template: {
          text: gettext('Create Network')
        }
      });
    
    resourceType.itemActions
      .append({
        id: 'createSubnet',
        service: createSubnet,
        template: {
          text: gettext('Create Subnet')
        }
      })
      .append({
        id: 'createNetworkPort',
        service: createPort,
        template: {
          text: gettext('Create Network Port')
        }
      });
  }
})();
