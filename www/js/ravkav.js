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
const txtTouchContract = "לחץ על הסדר נסיעה לעריכה";
const txtNoContracts = "לא קיימים הסדרי נסיעה";
const txtAccumulativeSumHe = "ערך צבור";
const txtTrainHe = "רכבת";
const txtBusHe = "אוטובוס";
const txtAccumulativeSum = "tsover";
const txtTrain = "rakevet";
const txtBus = "bus";

//	Aliasing
const $outerDiv = $('#outerDiv');
const $iosStatusBar = $('#iosStatusBar');
const $contractsCanvas = $('#contractsCanvas');
const $addContractButton = $('#addContractButton');
const $addContractButtonBG = $('#addContractButtonBG');
const $addContractDialog = $( "#addContractDialog" );
const $typeTR = $("#typeTR");
const $valueTR = $("#valueTR");
const $valueNumInput = $('#valueNumInput');
const $valueDateInput = $('#valueDateInput');
const $typeSelectMenu = $("#typeSelectMenu").selectmenu();
const $valueLabel = $("#valueLabel");
const $contractTypeRadioButton = $("#contractTypeRadioButton");
const $trainComboSrc = $('#trainComboSrc');
const $trainComboDest = $('#trainComboDest');
const $editDialog = $('#editDialog');
const $aboutButton = $('#about');
const $aboutDialog = $('#aboutDialog');
const $description = $('#description')
const $descriptionInput = $('#descriptionInput')

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

	$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtAccumulativeSumHe + " בסך <a style='color:lightskyblue'>" + val +"</a> ש\"ח</button></div>");

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
			$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtTab + " ל" + txtTrainHe + " מתחנת <a style='color:lightgreen'>" + src + "</a> לתחנת <a style='color:lightgreen'>" + dest + "</a> עם <a style='color:lightskyblue'>" + val +"</a> נסיעות</button></div>");
		} else {
			//	Train, 30-days-pass
			var from = data[3];
			var to = data[4];
			$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txt30DaysPass + " ל" + txtTrainHe + " מתחנת <a style='color:lightgreen'>" + src + "</a> לתחנת <a style='color:lightgreen'>" + dest + "<a> מתאריך <a style='color:lightskyblue'>" + from +"</a> עד <a style='color:lightskyblue'>" + to+ "</a></button></div>");
		}
    } else {
    	//	Bus
    	if (contractType == txtTab) {
    		//	Bus, Tab
    		var drives = val[0];
    		var name = val.slice(1, val.length).join("_");
    		$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txtTab + " ל" + txtBusHe + " (<a style='color:lightgreen'>" + name + "</a>) עם <a style='color:lightskyblue'>" + drives +"</a> נסיעות</button></div>");
    	} else {
    		//	Bus, 30-days-pass
    		var from = val[0];
    		var to = val[1];
    		var name = val.slice(2, val.length).join("_");
    		$contractsCanvas.append("<div id='contract"+ id + "'><p></p><button id='btnContract" + id + "'>" + txt30DaysPass + " ל" + txtBusHe +  " (<a style='color:lightgreen'>" + name + "</a>) מתאריך <a style='color:lightskyblue'>" + from + "</a> עד <a style='color:lightskyblue'>" + to + "</a></button></div>");
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
	// 	validate description
	var desc = validateDescription();
	if (!desc) return null;

	//	validate value
	var val = validateValue();
	if (!val) return null;

	val.push(desc);
	return val;
}

// AccumulativeSum validation
function validateAccumulativeSum() {
	var val = $valueNumInput.val();
	if (!isNaN(parseFloat(val)) && isFinite(val) && (parseFloat(val) > 0)) {
		val = parseFloat(val).toFixed(2)
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
		    	} else {
		    		alert("הכנס ערך מספרי");
		    	}
			}
			break;
		case txt30DaysPass:
			{
				$valueDateInput.datepicker('option', 'dateFormat', 'mm/dd/yy');
				var txtDate =  $valueDateInput.val();
				var beginDate = new Date(txtDate);
				var endDate = new Date(dateInXDays(beginDate, 30));

				var today = new Date();
				var yesterday = dateInXDays(today, -1);

				var begin = dateWithDelim(beginDate, "dmy", "/");
				var end = dateWithDelim(endDate, "dmy", "/");

				//	"date" is set to 00:00:00 while today is with actual time.
				//	This is why we compare it with "yesterday" 
				if ( beginDate == "Invalid Date" ) {
					console.log("Invalid date! " + beginDate)
					return null;
				}

				if ( endDate < yesterday ) {
					// showMessage("alert", "תאריך לא חוקי", "תוקף הסדר הנסיעה שהזנת " + end + " פג, אנא בחר תוקף אחר", "", "");
					alert("תוקף הסדר הנסיעה שהזנת " + end + " פג, אנא בחר תוקף אחר");
					return null;
				}

				return [txt30DaysPass, begin, end];
			}
			break;
		default:
			return null;
	}
	return null;
}

function validateDescription () {
	var val = $descriptionInput.val();
	if (val.length == 0) {
		alert("הכנס תיאור")
		return null;
	}
	return val;
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
		title: "עריכת הסדר נסיעה",
		buttons: [
			{
				text: "מחק",
				style: "float:right",
				width: "33%",
				click: function() {
					removeContract(id, key);
					closeEditDialog();
				}
			},
			{
				text: "עדכן",
				style: "float:right",
				width: "33%",
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

								var beginDate = new Date(txtDate);
								var today = new Date();
								var yesterday = dateInXDays(today, -1);

								if (beginDate == "Invalid Date") {
									console.log("Invalid date! " + beginDate)

									// 	Stop processing, quit dialog
									closeEditDialog()
								}

								var begin = dateWithDelim(beginDate, "dmy", "/");
								var endDate = dateInXDays(beginDate, 30);
								var end = dateWithDelim(endDate, 'dmy', "/");

								//	"date" is set to 00:00:00 while today is with actual time.
								//	This is why we compare it with "yesterday"
								if (endDate < yesterday) {
									// showMessage("alert", "תאריך לא חוקי", "תוקף הסדר הנסיעה שהזנת " + end + " פג, אנא בחר תוקף אחר או מחק את ההסדר", "", "");
									alert("תוקף הסדר הנסיעה שהזנת " + end + " פג, אנא בחר תוקף אחר או מחק את ההסדר");
									return;

								} else {

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
			},
				{
				text: "בטל",
				style: "float:left",
				width: "33%",
				click: function() {
					closeEditDialog();
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
			data = data.toFixed(2);
			$('#contractEditLabel').text("ערך נוכחי: " + data + " ש\"ח");
		}

		$editDialog.append("<table id='contractEditDiv'><td><div id='contractEditLabel'>ערך נוכחי: " + data +" ש\"ח </div></td><tr><td><table><td><button id='dec' style='font-size:small'>הפחת</button></td><td><input type='number' id='contractEditValue' style='width:50px'/ value=0.00></td><td><button id='inc' style='font-size:small'>הוסף</button></td></table></td></tr></table>");
		document.getElementById('dec').onclick = function () {changeAccumulativeSum("dec") };
		document.getElementById('inc').onclick = function () {changeAccumulativeSum("inc") };
	} else {
		//	Type is Bus or Train
		var minType = data[0];
		if (minType == txtTab ) {
			var val = (type == "bus" ? data[1] : data[data.length-1]);

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

//	About Dialog
function aboutDialog() {

	$aboutDialog.dialog("open");

	// register Android back button
	document.addEventListener("backbutton", closeAboutDialog, false);
}

function closeAboutDialog() {
	$aboutDialog.dialog("close")
	document.removeEventListener("backbutton", closeAboutDialog, false);
}

$(document).ready( function () {

	// showMessage("alert", "welcome!", "welcoming", function (param) { console.log("returned " + param)}, ["ok" , "close"] );
	// showMessage("confirm", "welcome confirm!", "welcoming confirm", function (param) { console.log("confirm returned " + param)}, ["ok" , "close"] );

	//	Disable statusbar on iOS
	if (!isiOS()) {
		$iosStatusBar.hide();
	}

	//	Contracts canvas
	var contractsHeight = (($(window).height() - $outerDiv.height()) * adMobBannerPct);
	console.log ("window height is " + $(window).height() + " outerdiv is " + $outerDiv.height() + " and contracts is " + contractsHeight);
    $contractsCanvas.height( contractsHeight + "px");
    $contractsCanvas.text(txtNoContracts);
	initContracts();

    //	About button
    $aboutButton.bind("mousedown touchstart", function() {
		$aboutButton.css({'color':'white', 'background-color':'black', 'border-color': 'white'});
	});

    $aboutButton.bind("mouseup touchend", function() {
		$aboutButton.css({'color':'black', 'background-color':'white', 'border-color': 'black'});
		aboutDialog();
		// register Android back button
		document.addEventListener("backbutton", closeAboutDialog, false);
		event.preventDefault();
	});

	$aboutDialog.dialog({
		dialogClass: "no-close",
		autoOpen: false,
		draggable: false,
		modal: true,
		title: "אודות",
		width: "auto",
		buttons: [
			{
				text: "סגור",
				width: "100%",
				click: function() {
					closeAboutDialog();
				}
			}
		]
	});

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
	function showDescription (trigger) {
		if (trigger) {
			$description.show();
		} else {
			$description.hide();
		}
	}

    //	Dialog handling
    function clearForm() {
    	clearContracType();
    	$valueNumInput.val(0);
    	showTrainForm(false);
    	showTypeSelection(false);
    	showDescription(false);
    	$valueTR.hide();
		$typeTR.hide();
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
		title: "הוספת הסדר נסיעה חדש",
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
	clearForm();
	$trainComboSrc.hide();
	$trainComboDest.hide();
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
				showDescription(false);
				initWidgets(txtEntries, initTabTrain);
				break;
			case txtBus:
				showTrainForm(false);
				showTypeSelection(true);
				showDescription(true);
				initWidgets(txtEntries, initTabBus);
				break;
			case txtAccumulativeSum:
				showTrainForm(false);
				showTypeSelection(false);
				showDescription(false);
				initWidgets(txtSum, initAccumulativeSum);
				break;
		}
	});
});
