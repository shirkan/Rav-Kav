/*
	Rav-Kav mobile application for iOS, Android and Web 2.0.
	Liran Cohen, 2014.

	contact info:
	gshirkan@gmail.com
	http://github.com/shirkan
*/

// Global variables
var numContracts = ( localStorage.numContracts ? localStorage.numContracts : 0);
var contractID = ( localStorage.contractID ? localStorage.contractID : 0);

// Numeric value constants
const contractsGap = 150;
const initTabBus = 15;
const initTabTrain = 12;
const initAccumulativeSum = 100;
const adMobBannerPct = .83;
const todayFormatted = dateWithDelim("", "ymd", "-");
const todayNotFormatted = dateWithDelim("", "dmy", "/");
const before30days = dateInXDays("", -30);

// String constants
const txtEntries = ":מס׳ נסיעות";
const txtDate = ":תאריך התחלה"
const txtSum = ":הכנס סכום";
const txtTab = "כרטיסיה";
const txt30DaysPass = "חופשי-חודשי"
const txtNoStation = "בחר תחנה";
const txtTouchContract = "לחץ על חוזה לעריכה";
const txtNoContracts = "לא קיימים חוזים";
const txtAccumulativeSumHe = "ערך צבור";
const txtTrainHe = "רכבת";
const txtBusHe = "אוטובוס";
const txtAccumulativeSum = "tsover";
const txtTrain = "rakevet";
const txtBus = "bus";

//	Aliasing
const $contractsCanvas = $('#contractsCanvas');
const $addContractButton = $('#addContractButton');
const $addContractButtonBG = $('#addContractButtonBG');
const $typeTR = $("#typeTR");
const $valueTR = $("#valueTR");
const $valueNumInput = $('#valueNumInput');
const $valueDateInput = $('#valueDateInput');
const $typeSelectMenu = $("#typeSelectMenu").selectmenu();
const $valueLabel = $("#valueLabel");
const $addContractDialog = $( "#addContractDialog" );
const $contractTypeRadioButton = $("#contractTypeRadioButton");
const $outerDiv = $('#outerDiv');
const $iosStatusBar = $('#iosStatusBar');
const $trainComboSrc = $('#trainComboSrc');
const $trainComboDest = $('#trainComboDest');
const $editDialog = $('#editDialog');

/* Rav-Kav functions*/

// Save / Load data from localStorage
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
		case txtAccumulativeSum:
			addContractAccumulativeSum(id, data);
			break;
		case txtTrain:
			addContractBusTrain(id, txtTrain, data);
			break;
		case txtBus:
			addContractBusTrain(id, txtBus, data);
			break;
		default:
			break;
	}
}

//	Contracts canvas
function initContracts () {
	if (numContracts) {
		$contractsCanvas.text(txtTouchContract);
		for (var key in localStorage) {
			if (key.match(/_\d+/)) {

				// Parse id and load data from it
				loadData ( key.split("_")[1] );
			}
		}
	}
}

function addContractAccumulativeSum( id, val ) {
	if (numContracts == 1) {
		//	Already saved data and increased numContracts, so if ==1, this is the first item.
		$contractsCanvas.text(txtTouchContract);
	}

	$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtAccumulativeSumHe + " בסך " + val +"</button></div>");

	var e = document.getElementById("btnContract" + id);
	e.onclick = function () { editDialog(id) };
}

function addContractBusTrain( id, type, data ) {
	if (numContracts == 1) {
		//	Already saved data and increased numContracts, so if ==1, this is the first item.
		$contractsCanvas.text(txtTouchContract);
	}

	var contractType = data[0];
	var val = data.slice(1, data.length);

	if (type == txtTrain) {
		//	Train
		var src = data[1];
		var dest = data[2];
		if (contractType == txtTab) {
			//	Train, Tab
			var val = data[3];
			$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtTab + " ל" + txtTrainHe + " מתחנת " + src + " לתחנת " + dest + " עם " + val +" נסיעות</button></div>");
		} else {
			//	Train, 30-days-pass
			var from = data[3];
			var to = data[4];
			$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txt30DaysPass + " ל" + txtTrainHe + " מתחנת " + src + " לתחנת " + dest + " מתאריך " + from +" עד " + to+ "</button></div>");
		}
    } else {
    	//	Bus
    	if (contractType == txtTab) {
    		//	Bus, Tab
    		$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtTab + " ל" + txtBusHe + " עם " + val +" נסיעות</button></div>");
    	} else {
    		//	Bus, 30-days-pass
    		var from = val[0];
    		var to = val[1];
    		$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txt30DaysPass + " ל" + txtBusHe + " מתאריך " + from +" עד " + to+ "</button></div>");
    	}
    }

    var e = document.getElementById("btnContract" + id);
	e.onclick = function () { editDialog(id) };
}

// Train valiadation
function validateTrain() {
	// validate stations select
	var src = document.getElementById("trainValueSrc");
	src = src.options[src.selectedIndex].text;
	var dest = document.getElementById("trainValueDest");
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

// Bus validation
function validateBus () {
	//	validate value 
	return validateValue();
}

// AccumulativeSum validation
function validateAccumulativeSum() {
	var val = $valueNumInput.val();
	if (!isNaN(parseFloat(val)) && isFinite(val) && (parseFloat(val) > 0)) {
		val = parseFloat(val).toFixed(1)
		$valueNumInput.val(val);
		return val;
	}

	return 0;
}

function validateValue () {
	var type = $typeSelectMenu.selectmenu().val();
	switch (type) {
		case txtTab:
			{
				var val = $valueNumInput.val();
				val = parseInt(val);
				if (!isNaN(val) && isFinite(val) && (val > 0)) {
		    		return [txtTab, val];
		    	}
			}
			break;
		case txt30DaysPass:
			{
				 $valueDateInput.datepicker('option', 'dateFormat', 'mm/dd/yy');
				var txtDate =  $valueDateInput.val();
				var date = new Date(txtDate);
				var today = new Date();
				var yesterday = dateInXDays(today, -1);

				//	"date" is set to 00:00:00 while today is with actual time.
				//	This is why we compare it with "yesterday" 
				if (date == "Invalid Date" || date < yesterday ) {
					console.log("Invalid date! " + date)
					return null;
				}
				
				var begin = dateWithDelim(date, "dmy", "/");
				var end = dateWithDelim(dateInXDays(date, 30), "dmy", "/");

				return [txt30DaysPass, begin, end];
			}
			break;
		default:
			return null;
	}
	return null;
}

//	Edit dialog invokation
function editDialog( id ) {
	//	Key is in the form of _23
	var key = "_" + id;

	//	Raw data, an array
	var raw = localStorage.getItem(key).split("_");

	//	Each raw data contains the type as first element
	var type = raw[0];

	//	Keep the rest of the data, without type
	var data = raw.slice(1,raw.length);

	//	Removes contract from contracts list
	function removeContract ( id, key ) {
		//	Remove from canvas
		$('#contract' + id).remove();
		
		//	Remove from localStorage
		localStorage.removeItem(key);

		//	Update numContracts
		numContracts--;
		localStorage.numContracts--;

		if (numContracts == 0) {
			$contractsCanvas.text(txtNoContracts);
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

					if (type == txtAccumulativeSum) {
						var newValue = data;

						if ( newValue != raw[1]) {
							if ( parseFloat(newValue) <= 0 ) {
								removeContract(id, key);
							} else {
								raw[1] = newValue;
								localStorage.setItem(key, raw.join("_"));
								initContracts();
							}
						}

					} else {
						var minType = data[0];
						if (minType == txtTab ) {
							//	Train/Bus, Tab
							//	If 0, remove contract
							if (!val) { 
								removeContract(id, key); 
							} else {
								raw[raw.length-1] = val;
								localStorage.setItem(key, raw.join("_"));
								initContracts();
							}

						} else {
							//	Train/Bus, 30-days-pass
							var txtDate = $('#contractEditDate').val();
							var currDate = data[1];

							if ( txtDate != currDate ) {

								$('#contractEditDate').datepicker('option', 'dateFormat', 'mm/dd/yy');
								var txtDate = $('#contractEditDate').val();
								
								var date = new Date(txtDate);
								var today = new Date();
								var yesterday = dateInXDays(today, -1);

								if (date == "Invalid Date") {
									console.log("Invalid date! " + date)

									// 	Stop processing, quit dialog
									closeEditDialog()
								}

								var begin = dateWithDelim(date, "dmy", "/");
								date = dateInXDays(date, 30)
								
								//	"date" is set to 00:00:00 while today is with actual time.
								//	This is why we compare it with "yesterday"
								if (date < yesterday) {
									removeContract(id, key);
								} else {
									var end = dateWithDelim(date, 'dmy', "/");
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

	if (type == txtAccumulativeSum) {

		function changeAccumulativeSum ( param ) {
			var num = $('#contractEditValue').val();
			if (param == "inc") {
				data = parseFloat(data) + parseFloat(num);
			} else {
				data = parseFloat(data) - parseFloat(num);
			}
			data = data.toFixed(1);
			$('#contractEditLabel').text(data +" :ערך נוכחי");
		}

		$editDialog.append("<table id='contractEditDiv'><td><div id='contractEditLabel'>" + data +" :ערך נוכחי</div></td><tr><td><table><td><button id='dec' style='font-size:small'>הפחת</button></td><td><input type='number' id='contractEditValue' style='width:50px'/ value=0.0></td><td><button id='inc' style='font-size:small'>הוסף</button></td></table></td></tr></table>");
		document.getElementById('dec').onclick = function () {changeAccumulativeSum("dec") };
		document.getElementById('inc').onclick = function () {changeAccumulativeSum("inc") };
	} else {
		//	Type is Bus or Train
		var minType = data[0];
		if (minType == txtTab ) {
			var val = data[data.length-1];
			
			function changeVal ( param ) {
				if ( (parseInt(val) + param) >= 0 ) {
					val = parseInt(val) + param;
				}
				$('#contractEditValue').text(val);
			}

			$editDialog.append("<table id='contractEditDiv'><tr><td><button id='dec' style='font-size:xx-large'>-</button></td><td><div id='contractEditValue' style='font-size:xx-large'>" + val + "</div></td><td><button id='inc' style='font-size:xx-large'>+</button></td></tr></table>");
			document.getElementById('dec').onclick = function () {changeVal(-1) };
			document.getElementById('inc').onclick = function () {changeVal(1) };
		} else {
			//	30-days-pass
			if (type == txtBus) {
				var date = data[1];	
			} else {
				var date = data[3];
			}
			
			$editDialog.append("<div id='contractEditDiv' style='display:inline-block'><input type='date' id='contractEditDate' style='width:80px'/>"+ txtDate +"</div>");
			if ( !(isiOS() || isAndroid())) {
				$('#contractEditDate').prop('type','text');
				$('#contractEditDate').datepicker().prop('type','text');
			} else {
				date = iOSAndroidDateFormat(date)
			}
		
			$('#contractEditDate').datepicker('option', 'dateFormat', 'dd/mm/yy');
			$('#contractEditDate').val(date);
		}
	}

	$editDialog.dialog("open");

	// register Android back button
	document.addEventListener("backbutton", closeEditDialog, false);
}

function closeEditDialog() {
	$('#contractEditDiv').remove();
	$editDialog.dialog("close")
	document.removeEventListener("backbutton", closeEditDialog, false);
}

$(document).ready( function () {

	// showMessage("alert", "welcome!", "welcoming", function (param) { console.log("returned " + param)}, ["ok" , "close"] );
	// showMessage("confirm", "welcome confirm!", "welcoming confirm", function (param) { console.log("confirm returned " + param)}, ["ok" , "close"] );	

	//	Init & reset values 
	$contractsCanvas.text(txtNoContracts);
	initContracts();

	//	Disable statusbar on iOS
	if (!isiOS()) {
		$iosStatusBar.hide();
	}

	var contractsHeight = (($(window).height() - $outerDiv.height()) * adMobBannerPct);
	console.log ("window height is " + $(window).height() + " and contracts is " + contractsHeight);
    
    // Contracts
    $contractsCanvas.height( contractsHeight + "px");

    //	Add contract button logic
    $addContractButton.bind("mousedown touchstart", function() {
		$addContractButton.css({'color':'white', 'background-color':'black', 'border-color': 'white'});
		$addContractButtonBG.css({'background-color':'black'});
	});
	
	$addContractButton.bind("mouseup touchend", function() {
		$addContractButton.css({'color':'black', 'background-color':'white', 'border-color': 'black'});
		$addContractButtonBG.css({'background-color':'white'});

		$addContractDialog.dialog("open");
		// register Android back button
		document.addEventListener("backbutton", closeDialog, false);
		event.preventDefault();
	});

    //	Dialog handling
    function clearForm() {
    	clearContracType();
    	$valueNumInput.val(0);
    	$trainComboSrc.hide();
    	$trainComboDest.hide();
    	$typeTR.hide();
    	$valueTR.hide();
    }

    function clearContracType ( ) {
    	$("input[name=contractTypeValue]").attr('checked', false);
    	$("#lradio1").removeClass("ui-state-active");
    	$("#lradio2").removeClass("ui-state-active");
    	$("#lradio3").removeClass("ui-state-active");
    }

    function closeDialog() {
		clearForm();
		$addContractDialog.dialog("close")
		document.removeEventListener("backbutton", closeDialog, false);
	}

    // Dialog creation
    $addContractDialog.dialog({
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

					var val = $('input[name=contractTypeValue]:checked').val();
					var ok = 0;

					if ( val == txtTrain) {
						//	Train
						var data = validateTrain();
						if ( data ) {
							var id = saveData(txtTrain, data.join("_"));
							addContractBusTrain(id, txtTrain, data);
							ok = 1;
						}

					} else if ( val == txtBus) {
						//	Bus
						var data = validateBus();
						if ( data ) {
							var id = saveData(txtBus, data.join("_"));
							addContractBusTrain(id, txtBus, data);
							ok = 1;
						}
					} else {
						// AccumulativeSum
						var sum = validateAccumulativeSum();
						if ( sum ) {
							var id = saveData(txtAccumulativeSum, sum);
							addContractAccumulativeSum(id, sum);
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

	//	Add Contract dialog initalization
	$addContractDialog.hide();
	$contractTypeRadioButton.buttonset();
	$trainComboSrc.hide();
	$trainComboDest.hide();
	$valueTR.hide();
	$typeTR.hide();
	$valueDateInput.hide();

	//	Setup date input according to OS
	if ( !(isiOS() || isAndroid())) {
		$valueDateInput.prop('type','text');
		$valueDateInput.datepicker().prop('type','text');
	}
	$valueDateInput.datepicker('option', 'dateFormat', 'dd/mm/yy');

	//	Type selector on change handler
	$typeSelectMenu.change(function () {
		var sel = $typeSelectMenu.val();
		if (sel == txtTab) {
			//	Tab
			$valueNumInput.show();
			$valueDateInput.hide();
			$valueLabel.text(txtEntries);
		} else {
			// 30-days-pass
			$valueNumInput.hide();
			$valueDateInput.show();
			$valueLabel.text(txtDate);
		}
	});

	//	Contract type change
	$("input[name=contractTypeValue]").change(function () {
		var val = $('input[name=contractTypeValue]:checked').val();

		$valueNumInput.val("");

		if (isiOS() || isAndroid() ) {
			$valueDateInput.val(todayFormatted);
		} else {
			$valueDateInput.val(todayNotFormatted);	
		}
		
		// Display value modification widgets
		$valueTR.show();

		function showTrainForm ( trigger ) {
			if (trigger) {
				$trainComboSrc.show();
				$trainComboDest.show();
			} else {
				$trainComboSrc.hide();
				$trainComboDest.hide();
			}
		}

		function showTypeSelection (trigger) {
			if (trigger) {
				$typeSelectMenu.show();
				$typeTR.show();
			} else {
				$typeSelectMenu.hide();
				$typeTR.hide();
			}
		}

		function initWidgets( typeSelectMenuTxt, unitsVal) {
			$valueLabel.text(typeSelectMenuTxt);
			$typeSelectMenu.val(txtTab);
			$valueDateInput.hide();
			$valueNumInput.show();
			$valueNumInput.val(unitsVal);
		}

		switch (val) {
			case txtTrain:
				showTrainForm(true);
				showTypeSelection(true);
				initWidgets(txtEntries, initTabTrain);
				break;
			case txtBus:
				showTrainForm(false);
				showTypeSelection(true);
				initWidgets(txtEntries, initTabBus);
				break;
			case txtAccumulativeSum:
				showTrainForm(false);
				showTypeSelection(false);
				initWidgets(txtSum, initAccumulativeSum);
				break;
		}
	});
});
