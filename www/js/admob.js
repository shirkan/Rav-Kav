/*
	Admob utilities js by Liran Cohen
*/
var admobid = {};

function onDocLoad() {

    if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', startAds, false);
    } else {
        // alert
    }
}

function startAds() {
    initAd();
    initApp();
}

function initApp() {
    // display the banner & interstitial at startup
    if (AdMob) {
    	if(AdMob) {
            AdMob.createBanner( {
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true }
            );
         AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );
         // AdMob.showInterstitial();
        }
    }
}

function initAd(){
    if (AdMob) {
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
        admobid =  isAndroid() ? ad_units.android : ad_units.ios;

        // registerAdEvents();

    } else {
    	//	Only notify when using mobile device
    	if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        	alert( 'admob plugin not ready' );
        }
    }
}

document.addEventListener('onAdFailLoad', function(e){
    // handle the event
    setTimeout(initApp, 3000);
});

// Optional, in case respond to events
// function registerAdEvents() {
// 	document.addEventListener('onReceiveAd', function(){});
//     document.addEventListener('onFailedToReceiveAd', function(data){});
//     document.addEventListener('onPresentAd', function(){});
//     document.addEventListener('onDismissAd', function(){ });
//     document.addEventListener('onLeaveToAd', function(){ });
//     document.addEventListener('onReceiveInterstitialAd', function(){ });
//     document.addEventListener('onPresentInterstitialAd', function(){ });
//     document.addEventListener('onDismissInterstitialAd', function(){ });
// }