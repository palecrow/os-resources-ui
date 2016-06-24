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
   * @name horizon.app.resources.os-neutron-nets
   * @description
   *
   * # horizon.app.resources.os-neutron-nets
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-neutron-nets', [
    'horizon.app.resources.os-neutron-nets.actions'
  ])
  .constant('horizon.app.resources.os-neutron-nets.resourceType', 'OS::Neutron::Net')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.resources.os-neutron-nets.basePath',
    'horizon.app.resources.os-neutron-nets.resourceType'
  ];

  function run(registry, neutron, basePath, networkResourceType) {
    registry.getResourceType(networkResourceType)
      .setNames(gettext('Network'), gettext('Networks'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name')
      })
      .setProperty('subnets', {
        label: gettext('Subnets Associated'),
        filters: [subnetList, 'noValue']
      })
      .setProperty('shared', {
        label: gettext('Shared'),
        filters: ['yesno']
      })
      .setProperty('router__external', {
        label: gettext('External'),
        filters: ['yesno']
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
      .setProperty('admin_state_up', {
        label: gettext('Admin State'),
        values: {
          true: gettext('Up'),
          false: gettext('Down')
        }
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::Net/\' + item.id $}">' +
          '{$ item.name $}</a>'
      })
      .append({
        id: 'subnets',
        priority: 1
      })
      .append({
        id: 'shared',
        priority: 1
      })
      .append({
        id: 'router__external',
        priority: 2
      })
      .append({
        id: 'status',
        priority: 2
      })
      .append({
        id: 'admin_state_up',
        priority: 2
      });

    function listFunction() {
      return neutron.getNetworks();
    }

    function subnetList(items) {
      if (!items) {
        return "";
      }
      return items.map(function getCidr(item) {
        return item.cidr;
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
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-neutron-nets';
    $provide.constant('horizon.app.resources.os-neutron-nets.basePath', path);
  }


})();
