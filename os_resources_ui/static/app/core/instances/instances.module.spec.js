/**
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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

  describe('horizon.app.core.instances', function() {
    it('should exist', function() {
      expect(angular.module('horizon.app.core.instances')).toBeDefined();
    });
  });

  describe('horizon.app.core.instances.basePath constant', function () {
    var instancesBasePath;

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.app.core.instances'));
    beforeEach(inject(function ($injector) {
      instancesBasePath = $injector.get('horizon.app.core.instances.basePath');
    }));

    it('should be defined', function () {
      expect(instancesBasePath).toBeDefined();
    });

    it('should equal to "/static/app/core/instances/"', function () {
      expect(instancesBasePath).toEqual('/static/app/core/instances/');
    });
  });

})();
