/* global alert */
'use strict';

(function() {
  function AddToolCtrl($scope, $routeParams, ToolApi, $location, AuthenticationService, UserApi, BIEventService) {
    var self = this;
    this.toolFormData = {
        // authorIp:
        // cfApiProjId:
        // cfApiOrgId
    };

    this.tagsEntryChanged = function () {
        this.toolFormData.tags = this.tagsEntry.split(', ');
    };

    this.loginAndSubmit = function() {
      AuthenticationService.loginWithTwitter().then(function () {
        submitToolForm();
      });
    };

    var submitToolForm = function(){
      if ($scope.toolForm.$valid){
        BIEventService.sendBIEvent('add-tool-submit', 'tools');
        angular.extend(self.toolFormData, getAdditionalFormData());
        ToolApi.saveTool(self.toolFormData).then(function(newToolId) {
          var data = {};
          data[newToolId] = true;
          UserApi.updateNestedUserPublicData(AuthenticationService.getAuthData().uid, data, 'toolList');
          $location.path('/');
        });
      } else {
        alert('The form is not valid');
      }
    };

    var getAdditionalFormData = function() {
      return {
        creatorId: AuthenticationService.getAuthData().uid,
        createdAt: Date.now(),
        type: 'tool',
        display: true
      };
    };
  }

  angular.module('civicMakersClientApp').controller('AddToolCtrl', AddToolCtrl);
})();
