define( function(require) {

  var schedulerParser= require('./scheduleParser');
  var calendarExporter = require('./calendarExporter');
  var data = "";

  document.getElementById('generateButton').onclick = function() {
    var input = document.getElementById('myInput').value;
    var data = schedulerParser.parseSchedule(input);
    var ical = calendarExporter.generate(data);
    calendarExporter.download(ical);
  }

});
