'use strict';

var chai = require('chai')
  , moment = require('./moment-civil')

chai.should()

moment.locale('en'
, { week:
    { dow: 6
    , doy: 12
    }
  , longDateFormat:
    { LT: 'HH:mm'
    , L: 'iYYYY/iMM/iDD'
    , LL: 'iD iMMMM iYYYY'
    , LLL: 'iD iMMMM iYYYY LT'
    , LLLL: 'dddd, iD iMMMM iYYYY LT'
    }
  }
)

describe('moment', function() {
	
  describe('#parse', function() {
    it('should parse gregorian dates', function() {
      var m = moment('1981/8/17 07:10:20', 'YYYY/M/D hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('1981-08-17 07:10:20')
      m.milliseconds().should.be.equal(0)
    })

    it('should parse correctly when input is only time', function() {
      var m = moment('07:10:20', 'hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('0000-01-01 07:10:20')
    })

    it('should parse when only Hijri year is in the format', function() {
      var m = moment('2017 03 07', 'YYYY MM DD')
      m.format('iYYYY-iMM-iDD').should.be.equal('1438-06-08')
      m = moment('07 15 06', 'MM YY DD')
      m.format('YYYY-MM-DD').should.be.equal('2015-07-06')
    })
    
	  it('should parse when only Hijri year is in the format', function() {
      var m = moment('08 1436 17', 'MM iYYYY DD')
      m.format('YYYY-MM-DD').should.be.equal('2014-08-17')
      m = moment('08 36 17', 'MM iYY DD')
      m.format('YYYY-MM-DD').should.be.equal('2014-08-17')
    })

    it('should parse when only Hijri month string is in the format', function() {
      var m = moment('1990 Sha 25', 'YYYY iMMM D')
      m.format('YYYY-MM-DD').should.be.equal('1990-03-25')
      m = moment('1990 Sha’ban 25', 'YYYY iMMMM D')
      m.format('YYYY-MM-DD').should.be.equal('1990-03-25')
    })
	 
    it('should parse when Hijri year and month are in the format', function() {
      var m = moment('25 1433 8', 'D iYYYY iM')
      m.format('YYYY-MM-DD').should.be.equal('2012-06-25')
      m = moment('1435 11', 'iYYYY iM')
      m.format('YYYY-MM-DD').should.be.equal('2014-08-27')
    })

    it('should parse when Hijri year and date are in the format', function() {
      var m = moment('26 1436 8', 'iD iYYYY M')
      m.format('YYYY-MM-DD').should.be.equal('2014-08-19')
    })

    it('should parse when Hijri year, month and date are in the format', function() {
      var m = moment('26 1430 5', 'iD iYYYY iM')
      m.format('YYYY-MM-DD').should.be.equal('2009-05-21')
    })

    it('should parse with complex format', function() {
      var m = moment('17 26 50 2014 50 8 12', 'D iD iYYYY YYYY M M jM')
      m.format('YYYY-MM-DD').should.be.equal('2014-12-17')
    })

    it('should parse format result', function() {
      var f = 'iYYYY/iM/iD hh:mm:ss.SSS a'
        , m = moment()
      moment(m.format(f), f).isSame(m).should.be.true
    })

    it('should be able to parse in utc', function() {
      var m = moment.utc('1436/8/20 07:10:20', 'iYYYY/iM/iD hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss Z').should.be.equal('2015-06-08 07:10:20 +00:00')
    })

    it('should parse with a format array', function() {
      var p1 = 'iYY iM iD'
        , p2 = 'iM iD iYY'
        , p3 = 'iD iYY iM'
        , m;
      m = moment('60 11 12', ['D YY M', 'M D YY', 'YY M D']);
      m.format('YY-MM-DD').should.be.equal('60-11-12')
      m = moment('10 11 12', [p1, p2, p3])
      m.format('iYY-iMM-iDD').should.be.equal('10-11-12')
      m = moment('10 11 12', [p2, p3, p1])
      m.format('iYY-iMM-iDD').should.be.equal('12-10-11')
      m = moment('10 11 12', [p3, p1, p2])
      m.format('iYY-iMM-iDD').should.be.equal('11-12-10')
      m = moment('10 11 12', [p3, p2, p1])
      m.format('iYY-iMM-iDD').should.be.equal('11-12-10')
      m = moment('60-11-12', [p3, p2, p1])
      m.format('iYY-iMM-iDD').should.be.equal('60-11-12')
      m = moment('60 11 12', [p3, p2, p1])
      m.format('iYY-iMM-iDD').should.be.equal('60-11-12')
      m = moment('60 8 31', ['YY M D', 'iYY iM iD'])
      m.format('YY-MM-DD').should.be.equal('60-08-31')
      m = moment('60 8 31', ['iYY iM iD', 'YY M D'])
      m.format('YY-MM-DD').should.be.equal('60-08-31')
      m = moment('60 5 31', ['YY M D', 'iYY iM iD'])
      m.format('YY-MM-DD').should.be.equal('60-05-31')
      m = moment('40 5 29', ['iYY iM iD', 'YY M D'])
      m.format('iYY-iMM-iDD').should.be.equal('40-05-29')
    })
  })

  describe('#format', function() {
    it('should work normally when there is no Hijri token', function() {
      var m = moment('1981-08-17 07:10:20', 'YYYY-MM-DD hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('1981-08-17 07:10:20')
    })

    it('should format to Hijri with Hijri tokens', function() {
      var m = moment('2017-06-25 07:10:20', 'YYYY-MM-DD hh:mm:ss')
      m.format('iYYYY-iMM-iDD hh:mm:ss').should.be.equal('1438-09-30 07:10:20')
    })

    it('should format with escaped and unescaped tokens', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('[My] birt\\h y[ea]r [is] iYYYY or YYYY').should.be.equal('My birth year is 1401 or 1981')
    })

    it('should format with mixed tokens', function() {
      var m = moment('2017-06-25', 'YYYY-MM-DD')
      m.format('iYYYY/iMM/iDD = YYYY-MM-DD').should.be.equal('1438/09/30 = 2017-06-25')
    })

    it('should format with iMo', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iMo').should.be.equal('10th')
    })

    it('should format with iM', function() {
      var m = moment('1981-05-17', 'YYYY-MM-DD')
      m.format('iM').should.be.equal('7')
    })

    it('should format with iMM', function() {
      var m = moment('1981-05-17', 'YYYY-MM-DD')
      m.format('iMM').should.be.equal('07')
    })

    it('should format with iMMM', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iMMM').should.be.equal('Shw')
    })

    it('should format with iMMMM', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iMMMM').should.be.equal('Shawwal')
    })

    it('should format with iDo', function() {
      var m = moment('2015-08-02', 'YYYY-MM-DD')
      m.format('iDo').should.be.equal('16th')
    })

    it('should format with iD', function() {
      var m = moment('2015-08-02', 'YYYY-MM-DD')
      m.format('iD').should.be.equal('16')
    })

    it('should format with iDD', function() {
      var m = moment('1981-05-17', 'YYYY-MM-DD')
      m.format('iDD').should.be.equal('13')
      m = moment('1981-05-13', 'YYYY-MM-DD')
      m.format('iDD').should.be.equal('09')
    })

    it('should format with iDDD', function() {
      var m = moment('2016-10-26', 'YYYY-MM-DD')
      m.format('iDDD').should.be.equal('24')
    })

    it('should format with iDDDD', function() {
      var m = moment('2016-10-15', 'YYYY-MM-DD')
      m.format('iDDDD').should.be.equal('013')
      m = moment('2015-11-09', 'YYYY-MM-DD')
      m.format('iDDDD').should.be.equal('026')
    })

    it('should format with iwo', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iwo').should.be.equal('41st')
    })

    it('should format with iw', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iw').should.be.equal('41')
    })

    it('should format with iww', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iww').should.be.equal('41')
      m = moment('1981-11-17', 'YYYY-MM-DD')
      m.format('iww').should.be.equal('04')
    })

    it('should format with iYY', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iYY').should.be.equal('01')
    })

    it('should format with iYYYY', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iYYYY').should.be.equal('1401')
    })

    it('should format with iYYYYY', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iYYYYY').should.be.equal('01401')
    })

    it('should format with igg', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('igg').should.be.equal('01')
    })

    it('should format with igggg', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('igggg').should.be.equal('1401')
    })

    it('should format with iggggg', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.format('iggggg').should.be.equal('01401')
    })

    it('should work with long date formats too', function() {
      var m = moment('2017-03-29 12:00', 'YYYY-MM-DD HH:mm')
      m.format('LT').should.be.equal('12:00')
      m.format('L').should.be.equal('1438/07/01')
      m.format('l').should.be.equal('1438/7/1')
      m.format('LL').should.be.equal('1 Rajab 1438')
      m.format('ll').should.be.equal('1 Raj 1438')
      m.format('LLL').should.be.equal('1 Rajab 1438 12:00')
      m.format('lll').should.be.equal('1 Raj 1438 12:00')
      m.format('LLLL').should.be.equal('Wednesday, 1 Rajab 1438 12:00')
      m.format('llll').should.be.equal('Wed, 1 Raj 1438 12:00')
    })
  })

  describe('#iConvert', function() {
    it('should convert 2014-09-17 to 1435-11-22', function() {
      var h = moment.iConvert.toHijri(2014, 9, 17);
      h.year.should.be.equal(1435);
      h.month.should.be.equal(11);
      h.date.should.be.equal(22);
    });

    it('should convert 2016-04-11 to 1437-07-03', function() {
      var h = moment.iConvert.toHijri(2016, 4, 11);
      h.year.should.be.equal(1437);
      h.month.should.be.equal(7);
      h.date.should.be.equal(3);
    })
	 
    it('should convert 1438-09-19 to 2017-06-14', function() {
      var g = moment.iConvert.toGregorian(1438, 09, 19);
      g.year.should.be.equal(2017);
      g.month.should.be.equal(6);
      g.day.should.be.equal(14);
    });

    it('should convert 1436-01-18 to 2013-01-09', function() {
      var g = moment.iConvert.toGregorian(1436, 1, 18);
      g.year.should.be.equal(2014);
      g.month.should.be.equal(11);
      g.day.should.be.equal(11);
    })
  })

  describe('#startOf', function() {
    it('should work as expected without Hijri units', function() {
      var m = moment('2015-04-03 07:10:20')
      m.startOf('year').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-01-01 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('month').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-04-01 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('day').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-04-03 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('week').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-03-28 00:00:00')
    })

    it('should return start of Hijri year, month and date', function() {
      var m = moment('2015-04-03 07:10:20')
      m.startOf('iYear').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-01-01 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('iMonth').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-01 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('day').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-13 00:00:00')
      m = moment('2015-04-03 07:10:20')
      m.startOf('week').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-07 00:00:00')
    })
  })

  describe('#endOf', function() {
    it('should work as expected without Hijri units', function() {
      var m;
      m = moment(new Date(2015, 1, 2, 3, 4, 5, 6))
      m.endOf('year').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-12-31 23:59:59')
      m = moment(new Date(2015, 1, 2, 3, 4, 5, 6))
      m.endOf('month').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-02-28 23:59:59')
      m = moment(new Date(2015, 1, 2, 3, 4, 5, 6))
      m.endOf('day').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-02-02 23:59:59')
      m = moment(new Date(2015, 1, 2, 3, 4, 5, 6))
      m.endOf('week').format('YYYY-MM-DD HH:mm:ss').should.be.equal('2015-02-06 23:59:59')
    })

    it('should return end of Hijri year, month and date', function() {
      var m = moment('2015-04-03 07:10:20')
      m.endOf('iYear').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-12-30 23:59:59')
      m = moment('2015-04-03 07:10:20')
      m.endOf('iMonth').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-29 23:59:59')
      m = moment('2015-04-03 07:10:20')
      m.endOf('day').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-13 23:59:59')
      m = moment('2015-04-03 07:10:20')
      m.endOf('week').format('iYYYY-iMM-iDD HH:mm:ss').should.be.equal('1436-06-13 23:59:59')
    })
  })

  describe('#iYear', function() {
    it('should return Hijri year', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.iYear().should.be.equal(1401)
    })

    it('should set Hijri year', function() {
      var m = moment('2015-04-14', 'YYYY-MM-DD')
      m.iYear(1438)
      m.format('iYYYY/iM/iD').should.be.equal('1438/6/24')
      m = moment('2016-10-04', 'YYYY-MM-DD')
      m.format('iYY/iM/iD').should.be.equal('38/1/2')
      m.iYear(1392)
      m.format('iYY/iM/iD').should.be.equal('92/1/2')
    })

    it('should also has iYears alias', function() {
      moment.fn.iYear.should.be.equal(moment.fn.iYears)
    })
  })
	
  describe('#iMonth', function() {
    it('should return Hijri month', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.iMonth().should.be.equal(9)
    })

    it('should set Hijri month', function() {
      var m = moment('2017-06-03', 'YYYY-MM-DD')
      m.iMonth(7)
      m.format('iYYYY/iM/iD').should.be.equal('1438/8/8')
      m = moment('2012-08-21', 'YYYY-MM-DD')
      m.format('iYY/iM/iD').should.be.equal('33/10/3')
      m.iMonth(11)
      m.format('iYY/iM/iD').should.be.equal('33/12/3')
      m = moment('2013-08-17', 'YYYY-MM-DD')
      m.format('iYY/iM/iD').should.be.equal('34/10/10')
      m.iMonth(11)
      m.format('iYY/iM/iD').should.be.equal('34/12/10')
    })

    it('should also has iMonths alias', function() {
      moment.fn.iMonth.should.be.equal(moment.fn.iMonths)
    })

    it('should set month by name and short name', function() {
      var m = moment(new Date(2015, 0, 1))
      m.iMonth('Shawwal')
      m.format('iYYYY/iM/iD').should.be.equal('1436/10/10')

      m = moment(new Date(2015, 0, 1))
      m.iMonth('Safar')
      m.format('iYYYY/iM/iD').should.be.equal('1436/2/10')

      m = moment(new Date(2015, 0, 1))
      m.iMonth('Jum-I')
      m.format('iYYYY/iM/iD').should.be.equal('1436/5/10')
    })
  })

  describe('#iDate', function() {
    it('should return Hijri date', function() {
      var m = moment('2016-07-30', 'YYYY-MM-DD')
      m.iDate().should.be.equal(24)
    })

    it('should set Hijri date', function() {
      var m = moment('2017-01-11', 'YYYY-MM-DD')
      m.iDate(29)
      m.format('iYYYY/iM/iD').should.be.equal('1438/4/29')
      m = moment('2017-03-18', 'YYYY-MM-DD')
      m.format('iYY/iM/iD').should.be.equal('38/6/19')
      m.iDate(29)
      m.format('iYY/iM/iD').should.be.equal('38/6/29')
      m.iDate(30)
      m.format('iYY/iM/iD').should.be.equal('38/7/1')
      m.iDate(30)
      m.format('iYY/iM/iD').should.be.equal('38/7/30')
      m.iDate(31)
      m.format('iYY/iM/iD').should.be.equal('38/8/1')
      m.iDate(90)
      m.format('iYY/iM/iD').should.be.equal('38/11/2')
    })

    it('should also has iDates alias', function() {
      moment.fn.iDate.should.be.equal(moment.fn.iDates)
    })
  })

  describe('#iDayOfYear', function() {
    it('should return Hijri date of year', function() {
      var m = moment('2014-11-22', 'YYYY-MM-DD')
      m.iDayOfYear().should.be.equal(29)
      m = moment('2015-10-18', 'YYYY-MM-DD')
      m.iDayOfYear().should.be.equal(4)
      m = moment('2016-09-23', 'YYYY-MM-DD')
      m.iDayOfYear().should.be.equal(345)
      m = moment('2017-09-21', 'YYYY-MM-DD')
      m.iDayOfYear().should.be.equal(354)
			m = moment('2017-10-02', 'YYYY-MM-DD')
      m.iDayOfYear().should.be.equal(11)
    })

    it('should set Hijri date of year', function() {
      var m = moment('2014-10-20', 'YYYY-MM-DD')
      m.iDayOfYear(30)
      m.format('iYYYY/iM/iD').should.be.equal('1435/1/30')
      m.iDayOfYear(354)
      m.format('iYY/iM/iD').should.be.equal('35/12/29')
      m.iDayOfYear(355)
      m.format('iYY/iM/iD').should.be.equal('36/1/1')
      m.iDayOfYear(356)
      m.format('iYY/iM/iD').should.be.equal('37/1/1')
      m.iDayOfYear(1)
      m.format('iYY/iM/iD').should.be.equal('37/1/1')
      m.iDayOfYear(33)
      m.format('iYY/iM/iD').should.be.equal('37/2/3')
      m.iDayOfYear(354 + 354)
      m.format('iYY/iM/iD').should.be.equal('38/12/29')
    })
  })
  
  describe('#iDaysInMonth', function() {
    it('should return Hijri days in Month', function() {
      var m = moment('1981-08-17', 'YYYY-MM-DD')
      m.iDaysInMonth().should.be.equal(29)
      m = moment('1986-2-2', 'YYYY-MM-DD')
      m.iDaysInMonth().should.be.equal(30)
    })

  })

	
})
