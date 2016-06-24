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
   * @name horizon.app.resources.os-neutron-router
   * @description
   *
   * # horizon.app.resources.os-neutron-router
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-neutron-routers', [
    'horizon.app.resources.os-neutron-routers.actions'
  ])
  .constant('horizon.app.resources.os-neutron-routers.resourceType', 'OS::Neutron::Router')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.resources.os-neutron-routers.basePath',
    'horizon.app.resources.os-neutron-routers.resourceType'
  ];

  function run(registry, neutron, basePath, resourceTypeName) {
    registry.getResourceType(resourceTypeName)
      .setNames(gettext('Router'), gettext('Routers'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name')
      })
      .setProperty('external_gateway_info', {
        label: gettext('External Network'),
        filters: [getNetworkId]
      })
      .setProperty('status', {
        label: gettext('Status'),
        values: {
          "ACTIVE":  gettext('Active'),
          "BUILD": gettext('Build'),
          "DOWN": gettext('Down'),
          "ERROR": gettext('Error')
        }
      })
      .setProperty('admin_state', {
        label: gettext('Admin State'),
        values: {
          "UP": gettext('Up'),
          "DOWN": gettext('Down')
        }
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::Router/\' + item.id $}">' +
          '{$ item.name $}</a>'
      })
      .append({
        id: 'status',
        priority: 1
      })
      .append({
        id: 'external_gateway_info',
        priority: 1
      })
      .append({
        id: 'admin_state',
        priority: 2
      });

    function listFunction() {
      return neutron.getRouters();
    }

    function getNetworkId(item) {
      return item.network_id;
    }
  }

  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-neutron-routers';
    $provide.constant('horizon.app.resources.os-neutron-routers.basePath', path);
  }



})();
