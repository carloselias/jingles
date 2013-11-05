'use strict';

angular.module('fifoApp')
.controller('MachinesCtrl', function ($scope, $http, $filter, wiggle, status, vmService) {

    $scope.infinitScroll = function() {
      if ($scope.tableParams.count >= $scope.vmsIds.length)
        return;
      $scope.tableParams.count += 5;
    }

    $scope.connect = function(vm) {
      if (vm.config.type == 'kvm')
        window.open('vnc.html?uuid=' + vm.uuid);
      else
        window.open('console.html?uuid=' + vm.uuid);
    }

    var filterData = function() {
      var p = $scope.tableParams;

      var dataArray = Object.keys($scope.vms).map(function(k) { return $scope.vms[k] })

      var data = $scope.searchQuery ? $filter('filter')(dataArray, $scope.searchQuery) : dataArray;
      data = p.sorting ? $filter('orderBy')(data, p.orderBy()) : $filter('orderBy')(data, 'config.alias');

      $scope.vmsFiltered = data.slice((p.page - 1) * p.count, p.page * p.count);
    }


    var init = function() {

      $scope.tableParams = {
        page: 1,
        count: 25,
        total: 0, //0=disable
        counts: [] ,//[] = disable
      }

      //When something on the table changes, i.e. infinit scroll detected.
      $scope.$watch('tableParams', function() {
        filterData()
      }, true);

      $scope.$watch('searchQuery', function(val) {
        filterData();
      })

      $scope.vmsIds = []
      $scope.vmsFiltered = []
      $scope.vms = {}

      wiggle.vms.list(function (ids) {

        $scope.vmsIds = ids;

        //Count the responses, to we can show the first vm's: probably not workth, becouse datasets and packages request are enqueued at the last... and we need them...
        var count = 0;

        ids.forEach(function(id) {

          wiggle.vms.get({id: id}, function success(res) {
            $scope.vms[id] =  vmService.updateCustomFields(res)

            count += 1;
            //Fire up showing the VM's when all data is loaded or the first bulk is¡ ready!
            if ($scope.vms.length == $scope.vmsIds.length || count  == $scope.tableParams.count - 1)
              filterData();
          })
          

        })

      })


      $scope.$on('state', function(e, msg) {
          var vm = $scope.vms[msg.channel];
          if (!vm) return;
          var failed = function(reason) {
              status.error("The creation of the VM " + vm.config.alias +
                           "(" + vm.uuid + ") failed. <br/>" + reason);
          }
          vm.state = msg.message.data;
          vmService.updateCustomFields(vm);
          if (vm.state == 'failed') {
              failed(vm.state_description);
          };
          $scope.$apply()
      })

      $scope.$on('update', function(e, msg) {
          var vm = $scope.vms[msg.channel];

          vm.config = msg.message.data.config;
          vmService.updateCustomFields(vm);

          /* Get the extra data */
          wiggle.datasets.get({id: vm.config.dataset}, function(ds) {
              vm.config._dataset = ds;
          })
          wiggle.packages.get({id: vm.config.package}, function(pack) {
              vm._package = pack
          })
          if (vm.owner)
              wiggle.orgs.get({id: vm.config.package}, function(org) {
                  vm._owner = org
              })

          $scope.$apply()
      })

      $scope.$on('delete', function(e, msg) {
          deleted.push(msg.channel);
          delete $scope.vms[msg.channel];
          $scope.$apply();
      })


  }
    init();


  });