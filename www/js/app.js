angular.module("alpha_real_estate_app", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","alpha_real_estate_app.controllers", "alpha_real_estate_app.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Alpha Real Estate App" ;
		$rootScope.appLogo = "data/images/aaa.png" ;
		$rootScope.appVersion = "0.1" ;
		$rootScope.headerShrink = true ;

		$ionicPlatform.ready(function() {
			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "alpha_real_estate_app",
				storeName : "alpha_real_estate_app",
				description : "The offline datastore for Alpha Real Estate App app"
			});


			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/alpha_real_estate_app/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("734e5827-f2cf-421f-9e91-34db6b0a56cf").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("alpha_real_estate_app.menu_1");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("objLabel", function(){
		return function (obj) {
			var new_item = [];
			angular.forEach(obj, function(child) {
				new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v,l) {
					if (indeks !== 0) {
					new_item.push(l);
				}
				indeks++;
				});
			});
			return new_item;
		}
	})
	.filter("objArray", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks !== 0){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})


.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	$ionicConfigProvider.tabs.style("standard");
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("alpha_real_estate_app",{
		url: "/alpha_real_estate_app",
		abstract: true,
		templateUrl: "templates/alpha_real_estate_app-tabs.html",
	})

	.state("alpha_real_estate_app.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"alpha_real_estate_app-about_us" : {
						templateUrl:"templates/alpha_real_estate_app-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"alpha_real_estate_app-dashboard" : {
						templateUrl:"templates/alpha_real_estate_app-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.faqs", {
		url: "/faqs",
		views: {
			"alpha_real_estate_app-faqs" : {
						templateUrl:"templates/alpha_real_estate_app-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.form_login", {
		url: "/form_login",
		views: {
			"alpha_real_estate_app-form_login" : {
						templateUrl:"templates/alpha_real_estate_app-form_login.html",
						controller: "form_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.form_order", {
		url: "/form_order",
		views: {
			"alpha_real_estate_app-form_order" : {
						templateUrl:"templates/alpha_real_estate_app-form_order.html",
						controller: "form_orderCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.form_user", {
		url: "/form_user",
		views: {
			"alpha_real_estate_app-form_user" : {
						templateUrl:"templates/alpha_real_estate_app-form_user.html",
						controller: "form_userCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.home", {
		url: "/home",
		views: {
			"alpha_real_estate_app-home" : {
						templateUrl:"templates/alpha_real_estate_app-home.html",
						controller: "homeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.menu_1", {
		url: "/menu_1",
		cache:false,
		views: {
			"alpha_real_estate_app-menu_1" : {
						templateUrl:"templates/alpha_real_estate_app-menu_1.html",
						controller: "menu_1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.menu_2", {
		url: "/menu_2",
		views: {
			"alpha_real_estate_app-menu_2" : {
						templateUrl:"templates/alpha_real_estate_app-menu_2.html",
						controller: "menu_2Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.order", {
		url: "/order",
		views: {
			"alpha_real_estate_app-order" : {
						templateUrl:"templates/alpha_real_estate_app-order.html",
						controller: "orderCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.profile", {
		url: "/profile",
		views: {
			"alpha_real_estate_app-profile" : {
						templateUrl:"templates/alpha_real_estate_app-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("alpha_real_estate_app.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"alpha_real_estate_app-slide_tab_menu" : {
						templateUrl:"templates/alpha_real_estate_app-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/alpha_real_estate_app/menu_1");
});
