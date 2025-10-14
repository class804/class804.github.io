let crazysdk;
let _adStarted;
let _adFinished;
let _adError;

/*
	SETTINGS
 */
const SDK_INTERFACE_SETTINGS = {

	isProd: true,
	debugLevel: 1,
	forceMockObject: true,

	// ads
	interstitial: {
		enabled: true, // enable/disable interstitial ads
		initial: false, // show initial ad
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		cooldown: 0, // time between ads
	},
	rewarded: {
		enabled: true, // enable/disable rewarded ads
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		reward: true // reward when in doubt
	},

	// files to load
	externalFiles: ["//sdk.crazygames.com/crazygames-sdk-v1.js"],

	// features
	features: {
		auto_quality: false,
		copyright: false,
		credits: false,
		external_achievements: false,
		external_leaderboard: false,
		external_mute: false,
		external_pause: false,
		external_start: false,
		forced_mode: false,
		leaderboard: false,
		multiplayer: false,
		multiplayer_local: true,
		skip_title: false,
		skip_tutorial: false
	},

	// forced mode
	forced_mode: {

	},

	// misc
	aid: "A1234-5", // affiliate id
	name: "Famobi", // name of partner/customer
	branding_url: "",
	branding_image: "logo", // "logo" = transparent
	show_splash: false,
	menuless: true
};

const SDK_INTERFACE_OVERRIDES = {
	famobi: {

		/*
		getCurrentLanguage: function() {
			return "en";
		},
		*/

		/*
		setPreloadProgress: function(progress) {

		},
		*/

		/*
		gameReady: function() {

		},

		playerReady: function(progress) {

		},
		*/
	},
	famobi_analytics: {
		trackEvent: function(event, params) {

			return new Promise(function(resolve, reject) {
				switch(event) {

					case "EVENT_LEVELSUCCESS":
					case "EVENT_LEVELFAIL":
						crazysdk.gameplayStop();
						return window.famobi.showAd(function() {
							resolve();
						});

					case "EVENT_LEVELRESTART":
					case "EVENT_LEVELSTART":
						crazysdk.gameplayStart();
						break;

					case "EVENT_PAUSE":
						crazysdk.gameplayStop();
						break;

					case "EVENT_RESUME":
						crazysdk.gameplayStart();
						break;

					default:
						// nothing to do
				}
				return resolve(event, params);
			});
		}
	}
}

const SDK_INTERFACE_PRELOAD_AD = function(type) {

	return new Promise(function(resolve, reject) {

		// DO YOUR MAGIC HERE!
		resolve(); // or reject()

	});
};

const SDK_INTERFACE_SHOW_AD = function() {

	return new Promise(function(resolve, reject) {

		let doCallback = function() {
			_adStarted = _adFinished = _adError = null;
			resolve();
		}

		_adStarted = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adStarted");
		};

		_adFinished = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adFinished");
			doCallback();
		}

		_adError = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adError");
			doCallback();
		};

		SDK_INTERFACE.getDebugLevel() && console.log("[CALL] crazysdk.requestAd('midgame')");
		crazysdk.requestAd('midgame');

	});
};

const SDK_INTERFACE_REWARDED_AD = function() {

	return new Promise(function(resolve, reject) {

		let doCallback = function(rewardGranted) {
			_adStarted = _adFinished = _adError = null;
			resolve(rewardGranted);
		}

		_adStarted = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adStarted");
		};

		_adFinished = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adFinished");
			doCallback(true);
		}

		_adError = function() {
			SDK_INTERFACE.getDebugLevel() && console.log("[CALL] adError");
			doCallback(false);
		};

		SDK_INTERFACE.getDebugLevel() && console.log("[CALL] crazysdk.requestAd('rewarded')");
		crazysdk.requestAd('rewarded');
	});
};

const SDK_INTERFACE_MOCK_OBJECT = function() {
	return new Promise(function(resolve, reject) {

		crazysdk = {
			init: function() {
				SDK_INTERFACE.getDebugLevel() && console.log("[MOCK:JS-SDK] initializing");
			},
			requestAd: function(type) {

				if(typeof _adStarted === "function") {
					_adStarted();
				}

				if(type === "rewarded") {
					if(confirm("Rewarded ad ended. Should a reward be granted?")) {
						if(typeof _adFinished === "function") {
							_adFinished();
						}
					} else {
						if(typeof _adError === "function") {
							_adError();
						}
					}

				} else {
					alert("This is an ad");

					if(typeof _adFinished === "function") {
						_adFinished();
					}
				}
			},
			gameplayStart: function() {
				SDK_INTERFACE.getDebugLevel() && console.log("[MOCK:JS-SDK] gameplayStart");
			},
			gameplayStop: function() {
				SDK_INTERFACE.getDebugLevel() && console.log("[MOCK:JS-SDK] gameplayStop");
			},
			addEventListener: function() {

			}
		};

		// DO YOUR MAGIC HERE!
		resolve();
	});
};

const SDK_INTERFACE_INIT = function() {
	return new Promise(function(resolve, reject) {

		if(!SDK_INTERFACE_SETTINGS.forceMockObject && typeof CrazyGames !== "undefined") {
			crazysdk = window.CrazyGames.CrazySDK.getInstance();
		}

		crazysdk.init();

		crazysdk.addEventListener('adStarted', function() {
			if(typeof _adStarted === "function") {
				_adStarted();
			}
		});

		crazysdk.addEventListener('adFinished', function() {
			if(typeof _adFinished === "function") {
				_adFinished();
			}
		});

		crazysdk.addEventListener('adError', function() {
			if(typeof _adError === "function") {
				_adError();
			}
		});

		resolve();
	});
};

SDK_INTERFACE.init(SDK_INTERFACE_SETTINGS);
