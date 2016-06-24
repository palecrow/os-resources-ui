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
   * @name horizon.app.resources.os-neutron-ports
   * @description
   *
   * # horizon.app.resources.os-neutron-ports
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-neutron-ports', [
    'horizon.app.resources.os-neutron-ports.actions'
  ])
  .constant('horizon.app.resources.os-neutron-ports.resourceType', 'OS::Neutron::Port')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.resources.os-neutron-ports.basePath',
    'horizon.app.resources.os-neutron-ports.resourceType'
  ];

  function run(registry, neutron, basePath, resourceTypeName) {
    registry.getResourceType(resourceTypeName)
      .setNames(gettext('Port'), gettext('Ports'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name'),
        filters: ['noValue']
      })
      .setProperty('fixed_ips', {
        label: gettext('Fixed IPs'),
        filters: [ipAddrs]
      })
      .setProperty('device_owner', {
        label: gettext('Attached Device'),
        filters: ['noValue']
      })
      .setProperty('device_id', {
        label: gettext('Attached Device ID'),
        filters: ['noValue']
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
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::Port/\' + item.id $}">' +
          '{$ item.name || item.id $}</a>'
      })
      .append({
        id: 'fixed_ips',
        priority: 1
      })
      .append({
        id: 'device_owner',
        priority: 1
      })
      .append({
        id: 'status',
        priority: 2
      })
      .append({
        id: 'admin_state',
        priority: 2
      });

    function listFunction() {
      return neutron.getPorts();
    }

    function ipAddrs(items) {
      return items.map(function getIpAddress(item) {
        return item.ip_address;
      }).join(', ');
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
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-neutron-ports';
    $provide.constant('horizon.app.resources.os-neutron-ports.basePath', path);
  }


})();
