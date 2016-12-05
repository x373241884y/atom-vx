ibsapp.register.controller('LoginCtrl', ['$scope', '$remote', '$nativeCall', '$window', '$cookieService', '$rootScope', '$location',
	function ($scope, $remote, $nativeCall, $window, $cookieService, $rootScope, $location) {
		//初始化
		$scope.startup = function () {
			var params = {
				LoginId: "jincongpeng",
				// LoginId: "jincongpeng",
				Password: "123afdfdaf213fafa",
				_vTokenName: "",
			};
			$remote.post("login.do", params, function (data) {
				if (data._RejCode === "000000") {
					console.log("success>>>???");
					console.log(data);
					$scope.statusSuccess = "success--------1";
				} else {
					$scope.statusSuccess = "faile.........2";
				}
			}, function (data) {
				console.log(data);
				$scope.statusSuccess = "faile........3";
			});
		};
	}]);
