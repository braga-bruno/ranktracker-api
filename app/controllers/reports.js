'use strict';

angular.module('myApp.reports', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/reports', {
    templateUrl: 'views/reports.html',
    controller: 'ReportsCtrl'
  });
}])

.controller('ReportsCtrl', function ($scope, $uibModal, ApiService, $rootScope) {

  $scope.openModal = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'views/modal.html',
      controller: 'ModalCtrl',
      windowClass: 'show',
    });

  };

  $scope.getReports = function() {
    
    ApiService.get('/report/list.json')
      .success(function (data, status, headers, config) {
        $scope.reports = data.items;
      })
      .error(function (data, status, headers, config) {
        console.log("error");
      }); 
  }

  $rootScope.$on('updateReports', function (event) { 
    console.log("updating reports");
    $scope.getReports();
  });

  if ((window.sessionStorage["session"] == undefined) || (new Date(window.sessionStorage["expires"]) < new Date())) {
    ApiService.login().then(function() {
      $scope.getReports()
    });
  } else {
    $scope.getReports();
  }

})
  
  .controller('ModalCtrl', function ($scope, $uibModalInstance, ApiService, $httpParamSerializerJQLike, $rootScope) {

  $scope.reportForm = {}
  $scope.reportForm.searchengines = []
  $scope.reportForm.keywords = []

  $scope.closeModal = function () {
    $uibModalInstance.close();
  }

  ApiService.get('/country/list.json')
    .success(function (data, status, headers, config) {
      $scope.countries = data;
      $scope.reportForm.country = $scope.countries[184];
    })
    .error(function (data, status, headers, config) {
      alert("Country List unavailable.");
    }); 

  $scope.addEngine = function (engine) {
    var index = $scope.reportForm.searchengines.indexOf(engine);
    if (index == -1) {
      $scope.reportForm.searchengines.push(engine);
    } else {
      $scope.reportForm.searchengines.splice(index, 1);
    }
  }

  $scope.submitForm = function() {
    if ($scope.reportForm.searchengines.length == 0) {
      $scope.no_engine = true;
      return
    } else {

      var body = $scope.reportForm;
      
      body.type = 'ranktracker';
      body.keywords = body.keywords.split('\n');
      body.countries = []
      body.countries.push(body.country.code);
      body.urls = []
      body.urls.push(body.url);

      ApiService.post('/report/new.json', $httpParamSerializerJQLike(body))
        .success(function (data, status, headers, config) {
          $rootScope.$emit('updateReports');
          $scope.closeModal();
        })
        .error(function (data, status, headers, config) {
          $scope.closeModal();
          alert("Unnable to create report.");
        }); 
    }
  }

});