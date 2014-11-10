/*
	Phonegap utilities js by Liran Cohen
*/

//	Date formats
	//	Convert dd/mm/yy to yy-mm-dd
	function iOSAndroidDateFormat(date) {
		var dateArray = date.split("/")
		return dateArray[2] + "-" + ("0" + dateArray[1]).slice(-2) + "-" + ("0" + dateArray[0]).slice(-2);
	}

//	Platform indication
	function isAndroid () {
		return ( /(android)/i.test(navigator.userAgent) );
	}

	function isiOS (){
		return ( /(ipad|iphone|ipod)/i.test(navigator.userAgent) );
	}

//	Send message in the relevant format
	function showMessage(type, title, message, callback, buttons) {

	    title = title || "default title";
	    buttons = buttons || 'OK';

	    if (type == "alert") {
				
		    if(navigator.notification && navigator.notification.alert) {

		        navigator.notification.alert(
		            message,    // message
		            callback,   // callback
		            title,      // title
		            buttons  // buttons
		        );

		    } else {

		        alert(message);
		        callback();
		    }    	
	    } else if (type == "confirm") {
	    	if(navigator.notification && navigator.notification.confirm) {

		        navigator.notification.confirm(
		            message,    // message
		            callback,   // callback
		            title,      // title
		            buttons  // buttons
		        );

		    } else {
		        callback(confirm(message));
		    }  
	    }

	}
