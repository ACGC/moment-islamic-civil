// moment.js locale configuration
// Locale: Arabic (ar)

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment-civil'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment-civil')); // Node
    } else {
        factory((typeof global !== 'undefined' ? global : this).moment); // node or other global
    }
}(function (moment) {
	var symbolMap = {
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
	    }, numberMap = {
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
	    }, pluralForm = function (n) {
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
	    return moment.defineLocale('ar', {
	     longDateFormat:
			{ LT: 'HH:mm'
			, L: 'iYYYY/iMM/iDD'
			, LL: 'iD iMMMM iYYYY'
			, LLL: 'iD iMMMM iYYYY LT'
			, LLLL: 'dddd، iD iMMMM iYYYY LT'
			}, calendar : {
		      sameDay: '[اليوم عند الساعة] LT',
			  nextDay: '[غدًا عند الساعة] LT',
			  nextWeek: 'dddd [عند الساعة] LT',
			  lastDay: '[أمس عند الساعة] LT',
			  lastWeek: 'dddd [عند الساعة] LT',
			  sameElse: 'L'
		}, relativeTime : {
			  future : 'بعد %s',
			  past : 'منذ %s',
			  s : pluralize('s'),
			  m : pluralize('m'),
			  mm : pluralize('m'),
			  h : pluralize('h'),
			  hh : pluralize('h'),
			  d : pluralize('d'),
			  dd : pluralize('d'),
			  M : pluralize('M'),
			  MM : pluralize('M'),
			  y : pluralize('y'),
			  yy : pluralize('y')
		}, preparse: function (string) {
		        return string.replace(/[۰-۹]/g, function (match) {
		      return numberMap[match]
		    }).replace(/،/g, ',')
		}, postformat: function (string) {
		        return string.replace(/\d/g, function (match) {
		      return symbolMap[match]
		    }).replace(/,/g, '،')
		}, ordinal: '%dم'
		 , week : {
			dow: 6 , // Saturday is the first day of the week.
		    doy: 12 // The week that contains Jan 1st is the first week of the year.
		}, meridiem: function (hour) {
		    return hour < 12 ? 'م' : 'ص'
		}
		, iMonths: 'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_')
		, iMonthsShort: 'محرم_صفر_ربيع ١_ربيع ٢_جمادى ١_جمادى ٢_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_')
		, weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_')
		, weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_')
		, weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_')
		  
	    });
		}));
