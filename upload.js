var upload = angular.module('sam-app', []);
upload.controller('MainCtrl', function($scope,$rootScope) {
  $scope.data="";
  $scope.$on('fileReader', function(event, fileReader) {
    $scope.$apply(function () {
      $scope.data = fileReader;
      console.log($scope.data);
    });
  });
});
upload.directive('fileReader', function($rootScope) {
  return {
    scope: {
      fileReader:"=",
      fileName:"@"
    },
    link: function(scope, element) {
     // console.log(element);
      $(element).on('change', function(changeEvent) {
    	  var files = changeEvent.target.files;
          if (files.length) {
            var r = new FileReader();
            r.onload = function(e) {
            		var data = e.target.result;
            		var cfb = XLS.CFB.read(data, {type: 'binary'});
            		var wb = XLS.parse_xlscfb(cfb);
            		// Loop Over Each Sheet
            		var result = {};
                var arr = [];
            		wb.SheetNames.forEach(function(sheetName) {
                    var obj = {};
            		    // Obtain The Current Row As CSV
                    // var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
                    // var sObj = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
            		    var oJS = XLS.utils.make_Array(wb.Sheets[sheetName]);   
            		    obj[sheetName] = oJS;
                    arr.push(obj);
            		});
                result['data'] = arr;
                if(scope.fileName !== undefined){
                  result['name'] = scope.fileName  
                }
                $rootScope.$broadcast('fileReader', result);
            };
           r.readAsBinaryString(files[0]);
          }
      });
    }
  };
});




