define(function(require) {

  var termReg = /(Spring|Summer|Fall|Winter)\s+(\d{4})\s+\|\s+([a-zA-Z]+)\s+\|\s+(.+)/;
  var courseReg = /^([A-Z]{2,}\ \w{1,5})\ -\ (.+)$/;
  var compReg = "Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date";
  var daysOfWeekReg = /^(Su)?(Mo|M)?(Tu|T)?(We|W)?(Th)?(Fr|F)?(Sa)?\s([\d\D]+)/;
  var rangeReg = /([\d\D]+)\s-\s([\d\D]+)/;
  var dayMap = {0:"SU",1:'MO',2:"TU",3:"WE",4:"TH",5:"FR",6:"SA"};

  var convertTo24Hour = function(time12Hour) {
    var timeMatch = time12Hour.match(/(\d{1,2}):(\d{2})(AM|am|PM|pm)?/);
    var hh = parseInt(timeMatch[1]);
    var mm = parseInt(timeMatch[2]);
    var apm = timeMatch[3];
    if (hh != 12 && (apm == "pm" || apm == "PM")) {
      hh += 12;
    } else if (hh == 12 && (apm == "am" || apm == "AM")) {
      hh = 0;
    }
    return {
      hour: hh > 9 ? "" + hh: "0" + hh,
      minute: mm > 9 ? "" + mm: "0" + mm
    }
  }

  return {
    termReg: termReg,
    courseReg: courseReg,
    compReg: compReg,
    daysOfWeekReg: daysOfWeekReg,
    rangeReg: rangeReg,
    dayMap:dayMap,
    convertTo24Hour: convertTo24Hour,
  }
});
