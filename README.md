# moment-hijri-civil

A Hijri calendar (Based on civil calculations) plugin for moment.js

# Installation
npm install @whitewater/moment-islamic-civil

# Where to use

## Node.js

var moment = require('moment-hijri');

moment().format('iYYYY/iM/iD');

## Require.js
require.config({
 
 paths: {
   
   "moment": "path/to/moment",
   
   "moment-hijri": "path/to/moment-hijri"

   }

});

define(["moment-hijri"], function (moment) {
  
  moment().format('iYYYY/iM/iD');

});


