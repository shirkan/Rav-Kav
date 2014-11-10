/*
	Admob utilities js by Liran Cohen 
*/

function onDocLoad() {
    if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
}

function initApp() {
    initAd();

    // display the banner at startup
    if (window.plugins && window.plugins.Admob) {
    	window.plugins.AdMob.createBannerView();
    }
}

function initAd(){
    if ( window.plugins && window.plugins.AdMob ) {
	    var ad_units = {
			ios : {
				banner: 'ca-app-pub-5934662800023467/7913750488',
				interstitial: 'ca-app-pub-5934662800023467/1867216886'
			},
			android : {
				banner: 'ca-app-pub-5934662800023467/2018980880',
				interstitial: 'ca-app-pub-5934662800023467/9390483684'
			}
	    };
        var admobid =  isAndroid() ? ad_units.android : ad_units.ios;

        window.plugins.AdMob.setOptions( {
            publisherId: admobid.banner,
            interstitialAdId: admobid.interstitial,
            bannerAtTop: false, // set to true, to put banner at top
            overlap: false, // set to true, to allow banner overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });

        registerAdEvents();
        
    } else {
    	//	Only notify when using mobile device
    	if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        	alert( 'admob plugin not ready' );
        }
    }
}

// Optional, in case respond to events
function registerAdEvents() {
	document.addEventListener('onReceiveAd', function(){});
    document.addEventListener('onFailedToReceiveAd', function(data){});
    document.addEventListener('onPresentAd', function(){});
    document.addEventListener('onDismissAd', function(){ });
    document.addEventListener('onLeaveToAd', function(){ });
    document.addEventListener('onReceiveInterstitialAd', function(){ });
    document.addEventListener('onPresentInterstitialAd', function(){ });
    document.addEventListener('onDismissInterstitialAd', function(){ });
}