app.factory('sessionsService', ['$http', function($http){
	return $http.get('http://localhost:3001/api/v1/sessions')
		.success(function(data) {
			return data;
		})
		.error(function(err){
			return err;
		});
}]);
