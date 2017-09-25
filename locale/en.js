// moment.js locale configuration
// Locale: English (en)

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment-civil'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment-civil')); // Node
    } else {
        factory((typeof global !== 'undefined' ? global : this).moment); // node or other global
    }
}(function (moment) {
	return moment.defineLocale('en',
	{ longDateFormat:
    { LT: 'HH:mm'
    , L: 'iYYYY/iMM/iDD'
    , LL: 'iD iMMMM iYYYY'
    , LLL: 'iD iMMMM iYYYY LT'
    , LLLL: 'dddd، iD iMMMM iYYYY LT'
  },calendar : {
      sameDay : '[Today at] LT',
      nextDay : '[Tomorrow at] LT',
      nextWeek : 'dddd [at] LT',
      lastDay : '[Yesterday at] LT',
      lastWeek : '[Last] dddd [at] LT',
      sameElse : 'L'
  },
  relativeTime : {
      future : 'in %s',
      past : '%s ago',
      s : 'a few seconds',
      m : 'a minute',
      mm : '%d minutes',
      h : 'an hour',
      hh : '%d hours',
      d : 'a day',
      dd : '%d days',
      M : 'a month',
      MM : '%d months',
      y : 'a year',
      yy : '%d years'
  }
  ,ordinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal : function (number) {
      var b = number % 10,
          output = (~~(number % 100 / 10) === 1) ? 'th' :
          (b === 1) ? 'st' :
          (b === 2) ? 'nd' :
          (b === 3) ? 'rd' : 'th';
      return number + output;
  }
  , week:
	{ dow: 6 // Saturday is the first day of the week.
	, doy: 12 // The week that contains Jan 1st is the first week of the year.
	}
  , meridiem: function (hour) {
      return hour < 12 ? 'am' : 'pm'
    }
  , iMonths: 'Muharram_Safar_Rabie Awal_Rabie thani_Jamaad Awal_Jamaad Thani_Ragab_Shabaan_Ramadan_Shawaal_Thul keida_Thul Hajj'.split('_')
  , iMonthsShort: 'Muh_Saf_Rab-I_Rab-II_Jum-I_Jum-II_Raj_Sha_Ram_Shw_Dhu-Q_Dhu-H'.split('_')
  , weekdays : 'ٍSunday_Monday_Tuesday_Wednsday_Thursday_Friday_Saturday'.split('_')
  , weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_')
  , weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_')
  });
}));