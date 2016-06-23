/**
 * (c) Copyright 2016 NEC Corporation, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
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

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname horizon.app.core.snapshots
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display snapshots related content.
   */
  angular
    .module('horizon.app.resources.os-cinder-snapshots', [
      'ngRoute'
    ])
    .constant('horizon.app.resources.os-cinder-snapshots.resourceType', 'OS::Cinder::Snapshot')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.cinder',
    'horizon.app.resources.os-cinder-snapshots.basePath',
    'horizon.app.resources.os-cinder-snapshots.resourceType'
  ];

  function run(registry, cinder, basePath, snapshotResourceType) {
    registry.getResourceType(snapshotResourceType)
      .setNames(gettext('Snapshot'), gettext('Snapshots'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name')
      })
      .setProperty('description', {
        label: gettext('Description')
      })
      .setProperty('size', {
        label: gettext('Size')
      })
      .setProperty('status', {
        label: gettext('Status')
      })
      .setProperty('volume_name', {
        label: gettext('Volume Name')
      })
      .setProperty('created_at', {
        label: gettext('Created At')
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Cinder::Snapshot/\' + item.id $}">' +
          '{$ item.name $}</a>'
      })
      .append({
        id: 'description',
        priority: 1,
        filters: ['noValue']
      })
      .append({
        id: 'size',
        priority: 1,
        filters: ['gb']//TODO: Use GiB
      })
      .append({
        id: 'status',
        priority: 2
      })
      .append({
        id: 'volume_name',
        priority: 2,
        filters: ['noValue']
      });

    function listFunction() {
      return cinder.getVolumeSnapshots();
    }
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-cinder-snapshots';
    $provide.constant('horizon.app.resources.os-cinder-snapshots.basePath', path);
  }
})();
