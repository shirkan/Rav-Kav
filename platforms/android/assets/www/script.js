// Global variables
var numContracts = ( localStorage.numContracts ? localStorage.numContracts : 0);
var contractID = ( localStorage.contractID ? localStorage.contractID : 0);
var today = new Date();
var todayFormatted = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
var todayNotFormatted = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
var before30days = new Date();
before30days.setDate(today.getDate() - 30);

// Value constants
const contractsGap = 150;
const initCaritisiaBus = 15;
const initCaritisiaRakevet = 12;
const initTsover = 100;
const tsoverWidth = "80px";
// const cartisiaWidth = "50px";
const adMobBannerPct = .83;

// Text constants
const txtNesiot = ":מס׳ נסיעות";
const txtDate = ":תאריך התחלה"
const txtSum = ":הכנס סכום";
const txtCartisia = "כרטיסיה";
const txtHofshiHodshi = "חופשי-חודשי"
const txtNoStation = "בחר תחנה";
const txtTouchContract = "לחץ על חוזה לעריכה";
const txtNoContracts = "לא קיימים חוזים";
const txtTsoverHe = "ערך צבור";
const txtRakevetHe = "רכבת";
const txtBusHe = "אוטובוס";
const txtTsover = "tsover";
const txtRakevet = "rakevet";
const txtBus = "bus";

//	Admob
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
    window.plugins.AdMob.createBannerView();
}

function isAndroid () {
	return ( /(android)/i.test(navigator.userAgent) );
}

function isiOS (){
	return ( /(ipad|iphone|ipod)/i.test(navigator.userAgent) );
}

//	Reformat date from dd/mm/yy to mm/dd/yy
function swapDateDayWithMonth (date) {
	var dateArray = date.split("/")
	return dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2]
}

//	input is in format of dd/mm/yyyy
function iOSAndroidDateFormat(date) {
	var dateArray = date.split("/")
	return dateArray[2] + "-" + ("0" + dateArray[1]).slice(-2) + "-" + ("0" + dateArray[0]).slice(-2);
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
// optional, in case respond to events
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

$(document).ready( function () {

	function closeEditDialog() {
		$('#edit_div').remove();
		$('#edit_dialog').dialog("close")
		document.removeEventListener("backbutton", closeEditDialog, false);
	}

	function closeDialog() {
		clearForm();
		$("#dialog").dialog("close")
		document.removeEventListener("backbutton", closeDialog, false);
	}

	// showMessage("alert", "welcome!", "welcoming", function (param) { console.log("returned " + param)}, ["ok" , "close"] );
	// showMessage("confirm", "welcome confirm!", "welcoming confirm", function (param) { console.log("confirm returned " + param)}, ["ok" , "close"] );	

	if (!isiOS()) {
		$('#ios_statusbar').hide();
	}

	var $contracts = $('#contracts');
	$contracts.text(txtNoContracts);

	var contracts_height = (($(window).height() - $('#outer_div').height()) * adMobBannerPct);
	console.log ("window height is " + $(window).height() + " and contracts is " + contracts_height);
    // Contracts
    $contracts.height( contracts_height + "px");

    // Set add contract button position
    var $button = $('#addContract');
    var $button_bg = $('#button_back');

    // $button_bg.css('width', $button.width() + 24);

	$button.bind("mousedown touchstart", function() {
		$button.css({'color':'white', 'background-color':'black', 'border-color': 'white'});
		$button_bg.css({'background-color':'black'});
	});
	
	$button.bind("mouseup touchend", function() {
		$button.css({'color':'black', 'background-color':'white', 'border-color': 'black'});
		$button_bg.css({'background-color':'white'});

		$dialog.dialog("open");
		// register Android back button
		document.addEventListener("backbutton", closeDialog, false);
		event.preventDefault();
	});

    // Save / Load handling

    function saveData ( type, data ) {

    	var currentID = contractID;
    	var key = "_" + currentID;
    	var val = type + "_" + data;
    	localStorage.setItem(key, val);
		
		contractID++;
		localStorage.contractID = contractID;

		numContracts++;
		localStorage.numContracts = numContracts;

		return currentID;
    }

    function loadData( id ) {

    	//	Parse info from value with id
    	var key = "_" + id;
    	var raw = localStorage.getItem(key).split("_");
    	var type = raw[0];
    	var data = raw.slice(1,raw.length);

    	switch (type){
    		case txtTsover:
    			addContractTsover(id, data);
    			break;
    		case txtRakevet:
    			addContractBusRakevet(id, txtRakevet, data);
    			break;
    		case txtBus:
    			addContractBusRakevet(id, txtBus, data);
    			break;
    		default:
    			break;
    	}
    }

    function initContracts () {
    	if (numContracts) {
    		$contracts.text(txtTouchContract);
    		for (var key in localStorage) {
    			if (key.match(/_\d+/)) {

    				// Parse id and load data from it
    				loadData ( key.split("_")[1] );
    			}
    		}
    	}
    }

    initContracts();

    //	Dialog handling

    var $dialog = $( "#dialog" );

    function clearForm() {
    	clearContracType();
    	$("#val_val").val(0);
    	$rakevet_form_a.hide();
    	$rakevet_form_b.hide();
    	$div_type.hide();
    	$div_val.hide();
    }

    function clearContracType ( ) {
    	$("input[name=contract_type]").attr('checked', false);
    	$("#lradio1").removeClass("ui-state-active");
    	$("#lradio2").removeClass("ui-state-active");
    	$("#lradio3").removeClass("ui-state-active");
    }

    function validateValue () {
    	var type = $selectmenu.val();
    	switch (type) {
    		case txtCartisia:
    			{
    				var val = $val_val.val();
    				val = parseInt(val);
    				if (!isNaN(val) && isFinite(val) && (val > 0)) {
			    		return [txtCartisia, val];
			    	}
    			}
    			break;
    		case txtHofshiHodshi:
    			{
    				$val_date.datepicker('option', 'dateFormat', 'mm/dd/yy');
    				var txtDate = $val_date.val();
    				var date = new Date(txtDate);
    				if (date == "Invalid Date") {
						console.log("Invalid date! " + date)
						return null;
					}
					
					var begin = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    				date.setDate(date.getDate() + 30);
    				var end = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    				return [txtHofshiHodshi, begin, end];
    			}
    			break;
    		default:
    			return null;
    	}
    	return null;
    }

    function editDialog( id ) {
    	var key = "_" + id;
    	var raw = localStorage.getItem(key).split("_");
    	var type = raw[0];
    	var data = raw.slice(1,raw.length);

    	var $editDialog = $('#edit_dialog');

    	function removeContract ( id, key ) {
    		//	Remove from canvas
			$('#contract' + id).remove();
			
			//	Remove from localStorage
			localStorage.removeItem(key);

			//	Update numContracts
			numContracts--;
			localStorage.numContracts--;

			if (numContracts == 0) {
				$contracts.text(txtNoContracts);
			}
    	}

    	$editDialog.dialog({
			dialogClass: "no-close",
			autoOpen: false,
			draggable: false,
			modal: true,
			width: "auto",
			"min-height": "inherit",
			title: "עריכת חוזה",
			buttons: [
				{
					text: "מחק חוזה",
					style: "float:right",
					click: function() {
						removeContract(id, key);
						$( this ).dialog( "close" );
					}
				},
				{ 
					text: "סיים עריכה",
					style: "float:left",
					click: function() {

						if (type == txtTsover) {
							var new_val = data;

							if ( new_val != raw[1]) {
								if ( parseFloat(new_val) <= 0 ) {
									removeContract(id, key);
								} else {
									raw[1] = new_val;
									localStorage.setItem(key, raw.join("_"));
									initContracts();
								}
							}

						} else {
							var minType = data[0];
							if (minType == txtCartisia ) {
								//	If 0, remove contract
								if (!val) { 
									removeContract(id, key); 
								} else {
									raw[raw.length-1] = val;
									localStorage.setItem(key, raw.join("_"));
									initContracts();
								}

							} else {
								//	Hofshi-Hodshi
								if ( $('#edit_date').val() != date) {
									$('#edit_date').datepicker('option', 'dateFormat', 'mm/dd/yy');
									var txtDate = $('#edit_date').val();
									var date = new Date(txtDate);

									if (date == "Invalid Date") {
										console.log("Invalid date! " + date)

										// 	Stop processing, quit dialog
										closeEditDialog()
									}

									var begin = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
									date.setDate(date.getDate() + 30);

									if (date < today) {
										removeContract(id, key);
									} else {
										var end = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
										if (type == txtBus) {
											raw[2] = begin;
											raw[3] = end;	
										} else {
											raw[4] = begin;
											raw[5] = end;	
										}
										
										localStorage.setItem(key, raw.join("_"));
										initContracts();
									}
								}
							}
						}
						closeEditDialog()
					}
				}
			]
		});

		if (type == txtTsover) {

			function changeTsover ( param ) {
				var num = $('#change_val').val();
				if (param == "inc") {
					data = parseFloat(data) + parseFloat(num);
				} else {
					data = parseFloat(data) - parseFloat(num);
				}
				data = data.toFixed(1);
				$('#tsover_val').text(data +" :ערך נוכחי");
			}

			$editDialog.append("<table id='edit_div'><td><div id='tsover_val'>" + data +" :ערך נוכחי</div></td><tr><td><table><td><button id='dec' style='font-size:small'>הפחת</button></td><td><input type='number' id='change_val' style='width:50px'/ value=0.0></td><td><button id='inc' style='font-size:small'>הוסף</button></td></table></td></tr></table>");
			document.getElementById('dec').onclick = function () {changeTsover("dec") };
			document.getElementById('inc').onclick = function () {changeTsover("inc") };
		} else {
			var minType = data[0];
			if (minType == txtCartisia ) {
				var val = data[data.length-1];
				
				function changeVal ( param ) {
					if ( (parseInt(val) + param) >= 0 ) {
						val = parseInt(val) + param;
					}
					$('#val').text(val);
				}

				$editDialog.append("<table id='edit_div'><tr><td><button id='dec' style='font-size:xx-large'>-</button></td><td><div id='val' style='font-size:xx-large'>" + val + "</div></td><td><button id='inc' style='font-size:xx-large'>+</button></td></tr></table>");
				document.getElementById('dec').onclick = function () {changeVal(-1) };
				document.getElementById('inc').onclick = function () {changeVal(1) };
			} else {
				//	Hofshi-Hodshi
				if (type == txtBus) {
					var date = data[1];	
				} else {
					var date = data[3];
				}
				
				$editDialog.append("<div id='edit_div' style='display:inline-block'><input type='date' id='edit_date' style='width:80px'/>"+ txtDate +"</div>");
				if ( !(isiOS() || isAndroid())) {
					$('#edit_date').prop('type','text');
					$('#edit_date').datepicker().prop('type','text');
				} else {
					date = iOSAndroidDateFormat(date)
				}
			
				$('#edit_date').datepicker('option', 'dateFormat', 'dd/mm/yy');
				$('#edit_date').val(date);
			}
		}

		$editDialog.dialog("open");

		// register Android back button
		document.addEventListener("backbutton", closeEditDialog, false);
    }

    // 	Rakevet & Bus generic add contract

	function addContractBusRakevet( id, type, data ) {
    	if (numContracts == 1) {
    		//	Saving data and incing numContracts to 1 in the first item
    		$contracts.text(txtTouchContract);
    	}

    	var contractType = data[0];
    	var val = data.slice(1, data.length);
 
 		if (type == txtRakevet) {
 			var src = data[1];
 			var dest = data[2];
	    	if (contractType == txtCartisia) {
	    		var val = data[3];
	    		$contracts.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtCartisia + " ל" + txtRakevetHe + " מתחנת " + src + " לתחנת " + dest + " עם " + val +" נסיעות</button></div>");
	    	} else {
	    		var from = data[3];
	    		var to = data[4];
	    		$contracts.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtHofshiHodshi + " ל" + txtRakevetHe + " מתחנת " + src + " לתחנת " + dest + " מתאריך " + from +" עד " + to+ "</button></div>");
	    	}
	    } else {
	    	if (contractType == txtCartisia) {
	    		$contracts.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtCartisia + " ל" + txtBusHe + " עם " + val +" נסיעות</button></div>");
	    	} else {
	    		var from = val[0];
	    		var to = val[1];
	    		$contracts.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtHofshiHodshi + " ל" + txtBusHe + " מתאריך " + from +" עד " + to+ "</button></div>");
	    	}
	    }

	    var e = document.getElementById("btnContract" + id);
    	e.onclick = function () { editDialog(id) };
    }

    // Rakevet handle

    function validateRakevet() {
    	// validate stations select
    	var src = document.getElementById("rakevet_src");
    	src = src.options[src.selectedIndex].text;
    	var dest = document.getElementById("rakevet_dest");
    	dest = dest.options[dest.selectedIndex].text;

    	if (src == txtNoStation || dest == txtNoStation) {
    		alert("בחר תחנה");
    		return 0;
    	}

    	if (src == dest) {
    		alert("בחר תחנות שונות");
    		return 0;
    	}

    	//	validate value 
    	var data = validateValue();
    	if (data) {
    		//	push src & dest
    		data.splice(1, 0, src, dest);
    		return data
    	}

    	return null;
    }

    // Bus handle

    function validateBus () {
    	//	validate value 
    	return validateValue();
    }

    // Tsover handle

    function validateTsover() {
    	var val = $("#val_val").val();
    	if (!isNaN(parseFloat(val)) && isFinite(val) && (parseFloat(val) > 0)) {
    		val = parseFloat(val).toFixed(1)
    		$("#val_val").val(val);
    		return val;
    	}

    	return 0;
    }

    function addContractTsover( id, val ) {
    	if (numContracts == 1) {
    		//	Saving data and incing numContracts to 1 in the first item
    		$contracts.text(txtTouchContract);
    	}

    	$contracts.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtTsoverHe + " בסך " + val +"</button></div>");

    	var e = document.getElementById("btnContract" + id);
    	e.onclick = function () { editDialog(id) };
    }

    // Dialog creation

    $dialog.dialog({
		dialogClass: "no-close",
		autoOpen: false,
		draggable: false,
		modal: true,
		title: "הוספת חוזה חדש",
		width: "auto",
		buttons: [
			{
				text: "בטל",
				style: "float:left",
				click: function() {
					closeDialog();
				}
			},
			{
				text: "הוסף",
				style: "float:right",
				click: function() {

					var val = $('input[name=contract_type]:checked').val();
					var ok = 0;

					if ( val == txtRakevet) {
						var data = validateRakevet();
						if ( data ) {
							var id = saveData(txtRakevet, data.join("_"));
							addContractBusRakevet(id, txtRakevet, data);
							ok = 1;
						}

					} else if ( val == "bus") {
						var data = validateBus();
						if ( data ) {
							var id = saveData(txtBus, data.join("_"));
							addContractBusRakevet(id, txtBus, data);
							ok = 1;
						}
					} else {
						// Tsover
						var sum_val = validateTsover();
						if ( sum_val ) {
							var id = saveData("tsover", sum_val);
							addContractTsover(id, sum_val);
							ok = 1;
						}
					}

					if (ok) {
						closeDialog();	
					}
				}
			}
		]
	});

	$dialog.hide();

	$("#radioset").buttonset();

	$rakevet_form_a = $('#rakevet_form_a');
	$rakevet_form_a.hide();
	$rakevet_form_b = $('#rakevet_form_b');
	$rakevet_form_b.hide();

	var $selectmenu = $("#selectmenu").selectmenu();
	$selectmenu.change(function () {
		var sel = $selectmenu.val();
		if (sel == txtCartisia) {
			$val_val.show();
			$val_date.hide();
			$("#lbl_val").text(txtNesiot);
		} else {
			// Hofshi-Hodshi
			$val_val.hide();
			$val_date.show();
			$("#lbl_val").text(txtDate);
		}
	});
	
	var $div_val = $("#div_val");
	$div_val.hide();

	var $div_type = $("#div_type");
	$div_type.hide();

	var $val_val = $('#val_val');
	var $val_date = $('#val_date');
	$val_date.hide();
	if ( !(isiOS() || isAndroid())) {
		$val_date.prop('type','text');
		$val_date.datepicker().prop('type','text');
	}
	$val_date.datepicker('option', 'dateFormat', 'dd/mm/yy');

	$("input[name=contract_type]").change(function () {
		var val = $('input[name=contract_type]:checked').val();

		$val_val.val("");

		if (isiOS() || isAndroid() ) {
			$val_date.val(todayFormatted);
		} else {
			$val_date.val(todayNotFormatted);	
		}
		
		// Display value modification widgets
		$div_val.show();

		if ( val == 'rakevet') {
			//Display rakevet form
			$rakevet_form_a.show();
			$rakevet_form_b.show();

			// Display combo box 
			$selectmenu.show();
			$div_type.show();

			// Change value widgets
			$selectmenu.val(txtCartisia);
			$("#lbl_val").text(txtNesiot);
			// $val_val.css('width', cartisiaWidth);
			$val_date.hide();
			$val_val.show();
			$val_val.val(initCaritisiaRakevet);
			return;
		}

		if ( val == 'bus') {
			//Don't display rakevet form
			$rakevet_form_a.hide();
			$rakevet_form_b.hide();
			
			// Display combo box 
			$div_type.show();
			$selectmenu.show();

			// Change value widgets
			$selectmenu.val(txtCartisia);
			$("#lbl_val").text(txtNesiot);
			// $val_val.css('width', cartisiaWidth);
			$val_date.hide();
			$val_val.show();
			$val_val.val(initCaritisiaBus);
			return;
		}

		if ( val == 'tsover') {
			//Don't display rakevet form
			$rakevet_form_a.hide();
			$rakevet_form_b.hide();

			// Don't display combo box 
			$selectmenu.hide();
			$div_type.hide();

			// Change value widgets
			$("#lbl_val").text(txtSum);
			// $val_val.css('width', tsoverWidth);
			$val_date.hide();
			$val_val.show();
			$val_val.val(initTsover);
			return;
		}
		
	});
});
