# moment-islamic-civil

A Hijri calendar (Based on civil calculations) plugin for moment.js

# Where to use
`moment-islamic-civil` works in Node.js.

### Node.js

```shell
npm install @whitewater/moment-islamic-civil
```


```js
var moment = require('moment-civil');
moment().format('iYYYY/iM/iD');
```


### Require.js

```js
require.config({
  paths: {
    "moment": "path/to/moment",
    "moment-civil": "path/to/moment-civil"
  }
});
define(["moment-civil"], function (moment) {
  moment().format('iYYYY/iM/iD');
});
```

API
---

This plugin tries to mimic `momentjs` api. Basically, when you want to format or parse a string, just add a `i` to the format token like 'iYYYY' or 'iM'. Also you can use the Long date formats for "En" and "Ar" locales.
For example:

```js
m = moment('1410/8/28', 'iYYYY/iM/iD'); // Parse a Hijri date.
m.format('iYYYY/iM/iD [is] YYYY/M/D'); // 1410/8/28 is 1990/3/25

m.iYear(); // 1410
m.iMonth(); // 7
m.iDate(); // 28
m.iDayOfYear(); // 236
m.iWeek(); // 35
m.iWeekYear(); // 1410

m.add(1, 'iYear');
m.add(2, 'iMonth');
m.format('iYYYY/iM/iD'); // 1411/10/28

m.iMonth(11);
m.startOf('iMonth');
m.format('iYYYY/iM/iD'); // 1411/12/1

m.iYear(1392);
m.startOf('iYear');
m.format('iYYYY/iM/iD'); // 1420/1/1

m = moment('2017-03-29 12:00', 'YYYY-MM-DD HH:mm');
    m.format('LT'); // 12:00
    m.format('L'); // 1438/07/01
    m.format('l'); // 1438/7/1
    m.format('LL'); // 1 Rajab 1438
    m.format('ll'); // 1 Raj 1438
    m.format('LLL'); // 1 Rajab 1438 12:00
    m.format('lll'); // 1 Raj 1438 12:00
    m.format('LLLL'); // Wednesday, 1 Rajab 1438 12:00
    m.format('llll'); // Wed, 1 Raj 1438 12:00

moment('1436/2/6 16:40', 'iYYYY/iM/iD HH:mm').format('YYYY-M-D HH:mm:ss'); // 2014-11-28 16:40:00

moment('2015-04-03 07:10:20').endOf('iMonth').format('iYYYY-iMM-iDD HH:mm:ss'); // 1436-06-29 23:59:59

m = moment('1990 Sha 25', 'YYYY iMMM D')
    m.format('YYYY-MM-DD'); // 1990-03-25
    
 m = moment('1990 Sha’ban 25', 'YYYY iMMMM D')
     m.format('YYYY-MM-DD'); // 1990-03-25
 
 m = moment('26 1436 8', 'iD iYYYY M')
     m.format('YYYY-MM-DD'); // 2014-08-19
```

To use the Arabic locale you need to do either:
- to import the arabic locale directly from : "moment-islamic-civil/locale/ar.js".
- or to use this function: moment().loadLocale('ar');

Acknowledgements
-------
This project was built from the great work done by [@behrang](https://github.com/behrang) whose behind [moment-jalaali](https://github.com/jalaali/moment-jalaali) project and [@xsoh](https://github.com/xsoh ) whose behind [moment-hijri](https://github.com/xsoh/moment-hijri) project. 
