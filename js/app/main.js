require(["require","jquery", "Bootstrap",'app/scheduleParser','app/calendarExporter'], function(require,$, Bootstrap) {

  var schedulerParser= require('app/scheduleParser');
  var calendarExporter = require('app/calendarExporter');
  var data = "";

  document.getElementById('generateButton').onclick = function() {
    var input = document.getElementById('myInput').value;
    var datetype = document.getElementById('dateFormat').value;
    var data = schedulerParser.parseSchedule(input,datetype);
    if(data.length>0){
      var ical = calendarExporter.generate(data);
      calendarExporter.download(ical);
    }
  }

});
