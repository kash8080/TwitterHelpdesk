const moment = require('moment-timezone');
//https://momentjs.com/docs/#/displaying/

function getDayOfWeek(timestamp){
  return moment.unix(timestamp).tz('Asia/Kolkata').format("E");
  //return moment.unix(timestamp).tz('Asia/Kolkata').format("E");
}

function getDate(timestamp) {
  return moment.unix(timestamp).tz('Asia/Kolkata').format("DD/MM/YYYY");
}

module.exports.getTimeAndA =function(timestamp) {
  return moment.unix(timestamp).tz('Asia/Kolkata').format("hh:mm A");
}

module.exports.getDateTimeFormat1=function(timestamp) {
  return moment.unix(timestamp).tz('Asia/Kolkata').format("MMM D, YYYY [at] hh:mm A");
}
function getDateAndTime(timestamp) {
  return moment.unix(timestamp).tz('Asia/Kolkata').format("DD/MM/YY hh:mm");
}
//dd:mm:yyyy hh:ss
function convertToTimestamp(date) {
  if (!date){
    return null;
  }
  //return moment("9/27/2019 01:14", "M/D/YYYY H:mm").tz('Europe/Dublin').format("M/D/YYYY H:mm");
  //return moment.tz("27:09:2019 20:48", "DD:MM:YYYY HH:mm", "Europe/Dublin").tz('Asia/Kolkata').format("DD:MM:YYYY HH:mm");
  return moment.tz(date, "DD:MM:YYYY HH:mm", "Asia/Kolkata").valueOf();
}

function convertToTimestampTwitter(date) {
  if (!date){
    return null;
  }
  //return moment("9/27/2019 01:14", "M/D/YYYY H:mm").tz('Europe/Dublin').format("M/D/YYYY H:mm");
  //return moment.tz("27:09:2019 20:48", "DD:MM:YYYY HH:mm", "Europe/Dublin").tz('Asia/Kolkata').format("DD:MM:YYYY HH:mm");
  return moment.tz(date, "ddd MMM D HH:mm:ss ZZ YYYY", "Asia/Kolkata").valueOf();
}

module.exports.getDate = getDate; 
module.exports.getDateAndTime = getDateAndTime; 
module.exports.getDayOfWeek = getDayOfWeek; 
module.exports.convertToTimestamp = convertToTimestamp;
module.exports.convertToTimestampTwitter = convertToTimestampTwitter;