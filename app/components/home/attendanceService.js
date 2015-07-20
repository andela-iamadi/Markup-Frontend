app.factory('attendanceService', ['$http', function($http){
	return $http.get('http://localhost:3001/api/v1/days/1/attendance')
		.success(function(data) {
			return data;
		})
		.error(function(err){
			return err;
		});
}]);
