define(function(require){

  var generate = function(courses){
    var calendarContent = "";
    function addLine(line){
        calendarContent += line + '\n';
    };

    addLine('BEGIN:VCALENDAR');
    addLine('VERSION:2.0');
    addLine('PRODID:-//Justin Hu//github.com\/WingOfFlame//EN');

    var numCourse = courses.length;

    for (var i = 0; i < numCourse; i++) {
      var components = courses[i].components;
      var numComp = components.length;
      for (var j = 0; j < numComp; j++) {
        var comp = components[j];

        addLine('BEGIN:VEVENT');
        addLine('CLASS:PUBLIC');

        addLine('DESCRIPTION:'+comp.DESCRIPTION);
        addLine('DTSTART:'+comp.DTSTART);
        addLine('RRULE:'+comp.RRULE);
        addLine('DTEND:'+comp.DTEND);
        addLine('DTSTAMP:'+comp.DTSTAMP);
        addLine('LOCATION:'+comp.LOCATION);
        addLine('SUMMARY;LANGUAGE=en-us:'+comp.SUMMARY);

        addLine('TRANSP:TRANSPARENT');
        addLine('END:VEVENT');
      }
    }
    return calendarContent;
  }

  var download = function(content) {
    // code copied from https://github.com/Trinovantes/Quest-Schedule-Exporter/blob/master/app/js/exporter.js
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', "course_schedule");
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

  return{
    generate:generate,
    download:download,
  }

})
