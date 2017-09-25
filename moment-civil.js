// moment-civil.js
// author: Samar Sultan 
// license: MIT

'use strict';

/************************************
    Expose Moment Hijri
************************************/
(function (root, factory) {
	/* global define */
	if (typeof define === 'function' && define.amd) {
		define(['moment'], function (moment) {
			root.moment = factory(moment)
			return root.moment
		})
	} else if (typeof exports === 'object') {
		module.exports = factory(require('moment'))
	} else {
		root.moment = factory(root.moment)
	}
})(this, function (moment) { // jshint ignore:line

	if (moment == null) {
		throw new Error('Cannot find moment')
	}

	/************************************
      Constants
  ************************************/
    var GREGORIAN_EPOCH = 1721425.5,
    ISLAMIC_EPOCH = 1948439.5;

	var formattingTokens = /(\[[^\[]*\])|(\\)?i(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
	localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g

	, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{1,4}/, parseTokenSixDigits = /[+\-]?\d{1,6}/, parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, parseTokenT = /T/i, parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/
    , symbolMap = {
		'1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
        '0': '٠'
    }
    , numberMap = {
		'١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    }
	, pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	}, plurals = {
	    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
	    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
	    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
	    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
	    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
	    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
	}, pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	}
	, unitAliases = {
		hm: 'imonth',
		hy: 'iyear'
	}
	, formatFunctions = {}
	
	, ordinalizeTokens = 'DDD w M D'.split(' '), paddedTokens = 'M D w'.split(' ')

	, formatTokenFunctions = {
		iM: function () {
			return this.iMonth() + 1
		},
		iMMM: function (format) {
			return this.localeData().iMonthsShort(this, format)
        },
		iMMMM: function (format) {
			return this.localeData().iMonths(this, format)
		},
		iD: function () {
			return this.iDate()
		},
		iDDD: function () {
			return this.iDayOfYear()
		},
		iw: function () {
			return this.iWeek()
		},
		iYY: function () {
			return leftZeroFill(this.iYear() % 100, 2)
		},
		iYYYY: function () {
			return leftZeroFill(this.iYear(), 4)
		},
		iYYYYY: function () {
			return leftZeroFill(this.iYear(), 5)
		},
		igg: function () {
			return leftZeroFill(this.iWeekYear() % 100, 2)
		},
		igggg: function () {
			return this.iWeekYear()
		},
		iggggg: function () {
			return leftZeroFill(this.iWeekYear(), 5)
		}
	}, i

	function padToken(func, count) {
		return function (a) {
			return leftZeroFill(func.call(this, a), count)
		}
	}

	function ordinalizeToken(func, period) {
		return function (a) {
			return this.localeData().ordinal(func.call(this, a), period)
		}
	}

	while (ordinalizeTokens.length) {
		i = ordinalizeTokens.pop()
		formatTokenFunctions['i' + i + 'o'] = ordinalizeToken(formatTokenFunctions['i' + i], i)
	}
	while (paddedTokens.length) {
		i = paddedTokens.pop()
		formatTokenFunctions['i' + i + i] = padToken(formatTokenFunctions['i' + i], 2)
	}
	formatTokenFunctions.iDDDD = padToken(formatTokenFunctions.iDDD, 3)

	/************************************
      Helpers
  ************************************/

	function extend(a, b) {
		var key
		for (key in b)
			if (b.hasOwnProperty(key))
				a[key] = b[key]
		return a
	}

	function leftZeroFill(number, targetLength) {
		var output = number + ''
		while (output.length < targetLength)
			output = '0' + output
		return output
	}

	function isArray(input) {
		return Object.prototype.toString.call(input) === '[object Array]'
	}

	function normalizeUnits(units) {
		return units ? unitAliases[units] || units.toLowerCase().replace(/(.)s$/, '$1') : units
	}

	function setDate(moment, year, month, date) {
		var utc = moment._isUTC ? 'UTC' : ''
		moment._d['set' + utc + 'FullYear'](year)
		moment._d['set' + utc + 'Month'](month)
		moment._d['set' + utc + 'Date'](date)
	}

	function objectCreate(parent) {
		function F() {}
		F.prototype = parent
		return new F()
	}

	function getPrototypeOf(object) {
		if (Object.getPrototypeOf)
			return Object.getPrototypeOf(object)
		else if (''.__proto__) // jshint ignore:line
			return object.__proto__ // jshint ignore:line
		else
			return object.constructor.prototype
	}

	/************************************
      Languages
  ************************************/
	extend(getPrototypeOf(moment.localeData()), {
		_iMonths: ['Muharram'
                , 'Safar'
                , 'Rabi\' al-Awwal'
                , 'Rabi\' al-Thani'
                , 'Jumada al-Ula'
                , 'Jumada al-Alkhirah'
                , 'Rajab'
                , 'Sha’ban'
                , 'Ramadhan'
                , 'Shawwal'
                , 'Thul-Qi’dah'
                , 'Thul-Hijjah'
                ],
		iMonths: function (m) {
			return this._iMonths[m.iMonth()]
		}

		,
		_iMonthsShort: ['Muh'
                      , 'Saf'
                      , 'Rab-I'
                      , 'Rab-II'
                      , 'Jum-I'
                      , 'Jum-II'
                      , 'Raj'
                      , 'Sha'
                      , 'Ram'
                      , 'Shw'
                      , 'Dhu-Q'
                      , 'Dhu-H'
                      ],
		iMonthsShort: function (m) {
			return this._iMonthsShort[m.iMonth()]
		}

		,
		iMonthsParse: function (monthName) {
			var i, mom, regex
			if (!this._iMonthsParse)
				this._iMonthsParse = []
			for (i = 0; i < 12; i += 1) {
				// Make the regex if we don't have it already.
				if (!this._iMonthsParse[i]) {
					mom = hMoment([2000, (2 + i) % 12, 25])
					regex = '^' + this.iMonths(mom, '') + '$|^' + this.iMonthsShort(mom, '') + '$'
					this._iMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i')
				}
				// Test the regex.
				if (this._iMonthsParse[i].test(monthName))
					return i
			}
		}, 
		_longDateFormat:
	      { LT: 'HH:mm'
	      , L: 'iYYYY/iMM/iDD'
	      , LL: 'iD iMMMM iYYYY'
	      , LLL: 'iD iMMMM iYYYY LT'
	      , LLLL: 'dddd، iD iMMMM iYYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        }
	});
	var iMonthNames = {
		iMonths: 'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_'),
		iMonthsShort: 'محرم_صفر_ربيع ١_ربيع ٢_جمادى ١_جمادى ٢_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_')
	};

	// Default to the momentjs 2.12+ API
	if (typeof moment.updateLocale === 'function') {
		moment.updateLocale('ar-sa', iMonthNames);
	} else {
		var oldLocale = moment.locale();
		moment.defineLocale('ar-sa', iMonthNames);
		moment.locale(oldLocale);
	}
	
	/************************************
      Formatting
  ************************************/

	function makeFormatFunction(format) {
		var array = format.match(formattingTokens),
			length = array.length,
			i

		for (i = 0; i < length; i += 1)
			if (formatTokenFunctions[array[i]])
				array[i] = formatTokenFunctions[array[i]]

		return function (mom) {
			var output = ''
			for (i = 0; i < length; i += 1)
				output += array[i] instanceof Function ? '[' + array[i].call(mom, format) + ']' : array[i]
			return output
		}
	}

	/************************************
      Parsing
  ************************************/

	function getParseRegexForToken(token, config) {
		switch (token) {
		case 'iDDDD':
			return parseTokenThreeDigits
		case 'iYYYY':
			return parseTokenFourDigits
		case 'iYYYYY':
			return parseTokenSixDigits
		case 'iDDD':
			return parseTokenOneToThreeDigits
		case 'iMMM':
		case 'iMMMM':
			return parseTokenWord
		case 'iMM':
		case 'iDD':
		case 'iYY':
		case 'iM':
		case 'iD':
			return parseTokenOneOrTwoDigits
		case 'DDDD':
			return parseTokenThreeDigits
		case 'YYYY':
			return parseTokenFourDigits
		case 'YYYYY':
			return parseTokenSixDigits
		case 'S':
		case 'SS':
		case 'SSS':
		case 'DDD':
			return parseTokenOneToThreeDigits
		case 'MMM':
		case 'MMMM':
		case 'dd':
		case 'ddd':
		case 'dddd':
			return parseTokenWord
		case 'a':
		case 'A':
			return moment.localeData(config._l)._meridiemParse
		case 'X':
			return parseTokenTimestampMs
		case 'Z':
		case 'ZZ':
			return parseTokenTimezone
		case 'T':
			return parseTokenT
		case 'MM':
		case 'DD':
		case 'YY':
		case 'HH':
		case 'hh':
		case 'mm':
		case 'ss':
		case 'M':
		case 'D':
		case 'd':
		case 'H':
		case 'h':
		case 'm':
		case 's':
			return parseTokenOneOrTwoDigits
		default:
			return new RegExp(token.replace('\\', ''))
		}
	}

	function addTimeToArrayFromToken(token, input, config) {
		var a, datePartArray = config._a

		switch (token) {
		case 'iM':
		case 'iMM':
			datePartArray[1] = input == null ? 0 : ~~input - 1
			break
		case 'iMMM':
		case 'iMMMM':
			a = moment.localeData(config._l).iMonthsParse(input)
			if (a != null)
				datePartArray[1] = a
			else
				config._isValid = false
			break
		case 'iD':
		case 'iDD':
		case 'iDDD':
		case 'iDDDD':
			if (input != null)
				datePartArray[2] = ~~input
			break
		case 'iYY':
			datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400)
			break
		case 'iYYYY':
		case 'iYYYYY':
			datePartArray[0] = ~~input
		}
		if (input == null)
			config._isValid = false
	}

	function dateFromArray(config) {
		var g,
		    h,
		    hy = config._a[0],
			hm = config._a[1],
			hd = config._a[2]

		if ((hy == null) && (hm == null) && (hd == null))
			return [0, 0, 1]
		hy = hy || 0
		hm = hm || 0
		hd = hd || 1
		if (hd < 1 || hd > hMoment.iDaysInMonth(hy, hm))
			config._isValid = false
		g = toGregorian(hy, hm, hd)
		h = toHijri(g.year, g.month, g.day)
		config._hDiff = 0
		if (~~h.year !== hy) 
			config._hDiff += 1
		if (~~h.month !== hm)
			config._hDiff += 1
		if (~~h.date !== hd)
			config._hDiff += 1
		return [g.year, g.month, g.day]
	}

	function makeDateFromStringAndFormat(config) {
		var tokens = config._f.match(formattingTokens),
			string = config._i,
			len = tokens.length,
			i, token, parsedInput

		config._a = []

		for (i = 0; i < len; i += 1) {
			token = tokens[i]
			parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0];
			if (parsedInput)
				string = string.slice(string.indexOf(parsedInput) + parsedInput.length)
			if (formatTokenFunctions[token])
				addTimeToArrayFromToken(token, parsedInput, config)
		}
		if (string)
			config._il = string

		return dateFromArray(config)
	}

	function makeDateFromStringAndArray(config, utc) {
		var len = config._f.length
		, i
		, format
		, tempMoment
		, bestMoment
		, currentScore
		, scoreToBeat

		if (len === 0) {
			return makeMoment(new Date(NaN))
		}

		for (i = 0; i < len; i += 1) {
			format = config._f[i]
			currentScore = 0
			tempMoment = makeMoment(config._i, format, config._l, utc)

			if (!tempMoment.isValid()) continue

			currentScore += tempMoment._hDiff
			if (tempMoment._il)
				currentScore += tempMoment._il.length
			if (scoreToBeat == null || currentScore < scoreToBeat) {
				scoreToBeat = currentScore
				bestMoment = tempMoment
			}
		}

		return bestMoment
	}
	
	function removeParsedTokens(config) {
		var string = config._i,
			input = '',
			format = '',
			array = config._f.match(formattingTokens),
			len = array.length,
			i, match, parsed

		for (i = 0; i < len; i += 1) {
			match = array[i]
			parsed = (getParseRegexForToken(match, config).exec(string) || [])[0]
			if (parsed)
				string = string.slice(string.indexOf(parsed) + parsed.length)
			if (!(formatTokenFunctions[match] instanceof Function)) {
				format += match
				if (parsed)
					input += parsed
			}
		}
		config._i = input
		config._f = format
	}

	/************************************
      Week of Year
  ************************************/

	function iWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
		var end = firstDayOfWeekOfYear - firstDayOfWeek,
			daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
			adjustedMoment

		if (daysToDayOfWeek > end) {
			daysToDayOfWeek -= 7
		}
		if (daysToDayOfWeek < end - 7) {
			daysToDayOfWeek += 7
		}
		adjustedMoment = hMoment(mom).add(daysToDayOfWeek, 'd')
		return {
			week: Math.ceil(adjustedMoment.iDayOfYear() / 7),
			year: adjustedMoment.iYear()
		}
	}

	/************************************
      Top Level Functions
  ************************************/

	function makeMoment(input, format, lang, utc) {
		var config =
			{ _i: input
			, _f: format
			, _l: lang
			}
			, date
			, m
			, hm
		if (format) {
			if (isArray(format)) {
				return makeDateFromStringAndArray(config, utc)
			} else {
				date = makeDateFromStringAndFormat(config)
				removeParsedTokens(config)
				format = 'YYYY-MM-DD-' + config._f
				input = leftZeroFill(date[0], 4) + '-'
					+ leftZeroFill(date[1] + 1, 2) + '-'
					+ leftZeroFill(date[2], 2) + '-'
					+ config._i
			}
		}
		if (utc)
			m = moment.utc(input, format, lang)
		else
			m = moment(input, format, lang)
		if (config._isValid === false)
			m._isValid = false
		m._hDiff = config._hDiff || 0
		hm = objectCreate(hMoment.fn)
		extend(hm, m)
		return hm
	}

	function hMoment(input, format, lang) {
		return makeMoment(input, format, lang, false)
	}

	extend(hMoment, moment)
	hMoment.fn = objectCreate(moment.fn)

	hMoment.utc = function (input, format, lang) {
		return makeMoment(input, format, lang, true)
	}

	/************************************
      hMoment Prototype
  ************************************/

	hMoment.fn.format = function (format) {
		var i, replace, me = this

		if (format) {
			i = 5
			replace = function (input) {
				return me.localeData().longDateFormat(input) || input
			}
			while (i > 0 && localFormattingTokens.test(format)) {
				i -= 1
				format = format.replace(localFormattingTokens, replace)
			}
			if (!formatFunctions[format]) {
				formatFunctions[format] = makeFormatFunction(format)
			}
			format = formatFunctions[format](this)
		}
		return moment.fn.format.call(this, format)
	}

	hMoment.fn.iYear = function (input) {
		var lastDay, h, g
		if (typeof input === 'number') {
			h = toHijri(this.year(), this.month(), this.date())
			lastDay = Math.min(h.date, hMoment.iDaysInMonth(input, h.month))
			g = toGregorian(input, h.month, lastDay)
			setDate(this, g.year, g.month, g.day)
			moment.updateOffset(this)
			return this
		} else {
			return toHijri(this.year(), this.month(), this.date()).year
		}
	}

	hMoment.fn.iMonth = function (input) {
		var lastDay, h, g
		if (input != null) {
			if (typeof input === 'string') {
				input = this.localeData().iMonthsParse(input)
				if(input >= 0) {
					input -= 1
				} else {
					return this
				}
			}
			h = toHijri(this.year(), this.month(), this.date())
			lastDay = Math.min(h.date, hMoment.iDaysInMonth(h.year, input))
			this.iYear(h.year + div(input, 12))
			input = mod(input, 12)
			if (input < 0) {
				input += 12
				this.iYear(this.iYear() - 1)
			}
			g = toGregorian(this.iYear(), input, lastDay)
			setDate(this, g.year, g.month, g.day)
			moment.updateOffset(this)
			return this
		} else {
			return toHijri(this.year(), this.month(), this.date()).month
		}
	}

	hMoment.fn.iDate = function (input) {
		var h, g
		if (typeof input === 'number') {
			h = toHijri(this.year(), this.month(), this.date())
			g = toGregorian(h.year, h.month, input)
			setDate(this, g.year, g.month, g.day)
			moment.updateOffset(this)
			return this
		} else {
			return toHijri(this.year(), this.month(), this.date()).date
		}
	}

	hMoment.fn.iDayOfYear = function (input) {
		var dayOfYear = Math.round((hMoment(this).startOf('day') - hMoment(this).startOf('iYear')) / 864e5) + 1
		return input == null ? dayOfYear : this.add(input - dayOfYear, 'd')
	}

	hMoment.fn.iDaysInMonth = function () {
		return parseInt(hMoment(this).endOf('iMonth').format('iDD'));
	}

	hMoment.fn.iWeek = function (input) {
		var week = iWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).week
		return input == null ? week : this.add( (input - week) * 7, 'd')
	}

	hMoment.fn.iWeekYear = function (input) {
		var year = iWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year
		return input == null ? year : this.add(input - year, 'y')
	}

	hMoment.fn.add = function (val, units) {
		var temp
		if (units !== null && !isNaN(+units)) {
			temp = val
			val = units
			units = temp
		}
		units = normalizeUnits(units)
		if (units === 'iyear') {
			this.iYear(this.iYear() + val)
		} else if (units === 'imonth') {
			this.iMonth(this.iMonth() + val)
		} else {
			moment.fn.add.call(this, val, units)
		}
		return this
	}

	hMoment.fn.subtract = function (val, units) {
		var temp
		if (units !== null && !isNaN(+units)) {
			temp = val
			val = units
			units = temp
		}
		units = normalizeUnits(units)
		if (units === 'iyear') {
			this.iYear(this.iYear() - val)
		} else if (units === 'imonth') {
			this.iMonth(this.iMonth() - val)
		} else {
			moment.fn.subtract.call(this, val, units)
		}
		return this
	}

	hMoment.fn.startOf = function (units) {
		units = normalizeUnits(units)
		if (units === 'iyear' || units === 'imonth') {
			if (units === 'iyear') {
				this.iMonth(0)
			}
			this.iDate(1)
			this.hours(0)
			this.minutes(0)
			this.seconds(0)
			this.milliseconds(0)
			return this
		} else {
			return moment.fn.startOf.call(this, units)
		}
	}

	hMoment.fn.endOf = function (units) {
		units = normalizeUnits(units)
		if (units === undefined || units === 'milisecond') {
			return this
		}
		return this.startOf(units).add(1, (units === 'isoweek' ? 'week' : units)).subtract(1, 'milliseconds')
	}
	
	hMoment.fn.clone = function () {
		return hMoment(this)
	}

	hMoment.fn.iYears = hMoment.fn.iYear
	hMoment.fn.iMonths = hMoment.fn.iMonth
	hMoment.fn.iDates = hMoment.fn.iDate
	hMoment.fn.iWeeks = hMoment.fn.iWeek

	/************************************
    hMoment Statics
************************************/

	hMoment.iDaysInMonth = function (year, month) {
		return getDaysInIslamicMonth(year, month);
	}
	
	hMoment.iConvert = {
		toHijri: toHijri,
		toGregorian: toGregorian
	}

	hMoment.loadLocale = function (name){
		var oldLocale = moment.locale();
            requirejs(['./locale/'+ name],function (moment){
            	 moment.locale(oldLocale);
        });
	}
	
	return hMoment

	/************************************
    Hijri Conversion
************************************/
	function toHijri(gy, gm, gd){
		var h = fromGregorian(new Date(gy ,gm ,gd));
		return {
			year : h.year,
			month: h.month,
			date : h.date
		};
	}

  function toGregorian(hy, hm, hd){
    var julianDay = hd + Math.ceil(29.5 * hm) + (hy - 1) * 354 + Math.floor((3 + 11 * hy) / 30) + ISLAMIC_EPOCH - 1;

    var wjd = Math.floor(julianDay - 0.5) + 0.5, depoch = wjd - GREGORIAN_EPOCH,
          quadricent = Math.floor(depoch / 146097), dqc = mod(depoch, 146097), cent = Math.floor(dqc / 36524),
          dcent = mod(dqc, 36524), quad = Math.floor(dcent / 1461), dquad = mod(dcent, 1461),
          yindex = Math.floor(dquad / 365);
    var year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
    if (!(cent === 4 || yindex === 4)) {
      year++;
    }

    var gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400);

    var yearday = wjd - gYearStart;

    var tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);

    var leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;

    var month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
    var tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) +
        Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) +1);

	var day = wjd - tjd2 + 1;
	
	var d = new Date(year, month - 1, day);
	    return {
	    	year :  d.getFullYear(),
	    	month : d.getMonth(),
	    	day :   d.getDate()
	    };
    }

    function isGregorianLeapYear(date) {
		var y = date.getFullYear();
        return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
	}
    
    function isIslamicLeapYear(year){
    	return (14 + 11 * year) % 30 < 11; 
    }
    
	 function getIslamicYearStart(year) {
		// summary:
		//		Return start of Islamic year.
		return (year - 1) * 354	+ Math.floor((3 + 11 * year) / 30.0);
	}
	 
	 function getIslamicMonthStart(year, month) {
		// summary:
		//		Return the start of Islamic Month.
		return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
	}
	 /**
	   * Returns the number of days in a specific Hijri month.
	   * `month` is 1 for Muharram, 2 for Safar, etc.
	   * `year` is any Hijri year.
	   */
	 function getDaysInIslamicMonth(year, month) {
	    year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        var length = 29 + month % 2;
        if (month === 12 && isIslamicLeapYear(year)) {
            length++;
        }
        return length;
	}
	
	/**
   * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
   * `gdate` is a JS Date to be converted to Hijri.
   */
  function fromGregorian(gdate) {
    var date = new Date(gdate);
	var gYear = date.getFullYear(),
		gMonth = date.getMonth(),
		gDay = date.getDate();

    var julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
        -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
        Math.floor(
            (367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(date) ? -1 : -2) + gDay);
    julianDay = Math.floor(julianDay) + 0.5;

    var days = julianDay - ISLAMIC_EPOCH;
    var hYear = Math.floor((30 * days + 10646) / 10631.0);
    var hMonth = Math.ceil((days - 29 - getIslamicYearStart(hYear)) / 29.5);
    hMonth = Math.min(hMonth, 11);
    var hDay = Math.ceil(days - getIslamicMonthStart(hYear, hMonth)) + 1;
    return {
			date : hDay,
		    month : hMonth,
		    year : hYear
		};
  }

	/*
  Utility helper functions.
*/

	function div(a, b) {
		return~~ (a / b)
	}

	function mod(a, b) {
		return a - ~~(a / b) * b
	}


});
