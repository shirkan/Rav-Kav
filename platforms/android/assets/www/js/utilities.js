/*
	Utilities js by Liran Cohen
*/

//	Date utilities
	/*	dateInXDays 
		input: 
			date - starting date (empty for today)
			x - days to add (or negative value for subtruction)
		output:
			the date in x days
	*/
	function dateInXDays (date, x) {
		date = (date == '') ? new Date() : date

		var result = new Date(date)
		result.setDate(date.getDate() + x)

		return result
	}

	/*	dateInXDays 
		input: 
			date - starting date (empty for today)
			format - string representing the format:
				d - day
				m - month
				y - full year

				for example: dmy 
				delim - delimiter to use in date format
		output:
			date in format 
	*/
	function dateWithDelim(date, format, delim) {
		date = (date == '') ? new Date() : date;
		delim = (delim == '') ? "/" : delim;

		var res = ""
		for ( var i = 0; i < format.length; i++ ) {
			switch (format[i]) {
				case "d":
					res = res + ("0" + date.getDate()).slice(-2)
					break;
				case "m":
					res = res + ("0" + (date.getMonth() +1)).slice(-2)
					break;
				case "y":
					res = res + date.getFullYear()
					break;
			}

			if (i < (format.length - 1)) {
				res = res + delim
			}
		}

		return res
	}