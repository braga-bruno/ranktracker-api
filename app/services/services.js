angular.module('myApp.services', [])

.factory('ApiService', function ($http, $q) {

	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	var APIURL = 'http://api.georanker.com/v1',
		APIKEY = 'e12e5067b618df3d758ebd780e1b1788',
		EMAIL = 'bruno_kmkz@hotmail.com';

	return {
		login: function() {

			console.log("login");

			return $http.get(APIURL + '/api/login.json' + '?email=' + EMAIL + '&apikey=' + APIKEY)
				.success(function (data, status, headers, config) {
					window.sessionStorage["session"] = data.session;
					window.sessionStorage["created"] = data.created;
					window.sessionStorage["expires"] = data.expires;
				})
				.error(function (data, status, headers, config) {
					console.log(data);
				});

		},
		post: function (action, body) {

			return $http({
				method: 'POST',
				url: APIURL + action + '?email=' + EMAIL + '&session=' + window.sessionStorage["session"],
				data: body,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				
			})

		},
		get: function (action) {

			return $http({
				method: 'GET',
				url: APIURL + action + '?email=' + EMAIL + '&session=' + window.sessionStorage["session"],
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			})

		},
  	}

});
