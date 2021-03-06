define(function(require) {

  var _util = require('util');

  var parseSchedule = function(input, datetype) {

    var extractData = function(input) {
      /*  States:
      1: finding term info
      2: finding course info
      3: finding start of course components
      4: finding all components
      */
      var state = 1;
      var lines = input.split('\n');
      var courses = [];

      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (/\S/.test(l)) { // string is not empty and not just whitespace
          if (state == 1) { // finding term info
            var termMatch = l.match(_util.termReg);
            if (termMatch) {
              var term = termMatch[1];
              var year = termMatch[2];
              var level = termMatch[3];
              var school = termMatch[4];
              state = 2;
            }
          } else if (state == 2) { // finding course title
            // Regexes modified from:
            // https://github.com/vikstrous/Quest-Schedule-Exporter/blob/master/index.php
            var courseMatch = l.match(_util.courseReg)
            if (courseMatch) {
              var code = courseMatch[1];
              var name = courseMatch[2];
              i += 2;
              var status = lines[i];
              if (status == "Enrolled") {
                state = 3;
                courses.push({
                  code: code,
                  name: name,
                  status: status,
                  components: []
                });
              }
            }
          } else if (state == 3) { // finding start of component info
            var componentMatch = l.match(_util.compReg)
            if (componentMatch) {
              state = 4;
            }
          } else if (state == 4) { // fetching all components
            var classNbr = lines[i];
            var section = lines[++i];
            var type = lines[++i];
            var timeRaw = lines[++i];
            var location = lines[++i].replace(/\s+/g, ' ');
            var instructor = lines[++i];
            while (instructor.endsWith(', ') || instructor.endsWith(',')) { // instructor more than one line
              instructor = instructor.concat(lines[++i]);
            }
            var dateRaw = lines[++i];
            var entry = {
              classNbr: classNbr,
              section: section,
              type: type,
              timeRaw: timeRaw,
              location: location,
              instructor: instructor,
              dateRaw: dateRaw
            };
            var valid = true;
            for (var key in entry) {
              if ("" == entry[key] || " " == entry[key] ) {//How about TBA?
                valid = false;
                break;
              }
            }
            if(valid){
              courses[courses.length - 1].components.push(entry)
            }
            //Peek next line to see if we have all components for this course
            var nl = lines[i + 1];
            if (!nl.match(/^\d{4,}$/)) {
              state = 2;
            }
          }
        }
      }
      return courses;
    }

    var processData = function(data, datetype) {

      for (var i = 0; i < data.length; i++) {
        var course = data[i];
        var components = course.components;
        for (var j = 0; j < components.length; j++) {
          var comp = components[j];

          var daysMatch = comp.timeRaw.match(_util.daysOfWeekReg)
          var timeMatch = daysMatch[8].match(_util.rangeReg);
          var timeFrom = _util.convertTo24Hour(timeMatch[1]);
          var timeTo = _util.convertTo24Hour(timeMatch[2]);

          daysMatch = daysMatch.slice(1,7);
          var daysOfWeek = []
          for (index in daysMatch) {
            if (daysMatch[index] && _util.dayMap[index]) {
              daysOfWeek.push(_util.dayMap[index]);
            }
          }



          /*
          convert date to: YYYY/MM/DD
          */
          var dateMatch = comp.dateRaw.match(_util.rangeReg);
          var dateFrom = dateMatch[1].split('/');
          var dateTo = dateMatch[2].split('/');
          switch (datetype) {
            case "1": // DD/MM/YYYY
              dateFrom = [dateFrom[2], dateFrom[1], dateFrom[0]];
              dateTo = [dateTo[2], dateTo[1], dateTo[0]];
              break;
            case "2":// MM/DD/YYYY
              dateFrom = [dateFrom[2], dateFrom[0], dateFrom[1]];
              dateTo = [dateTo[2], dateTo[0], dateTo[1]];
              break;
            case "3": // MM/YYYY/DD
              dateFrom = [dateFrom[1], dateFrom[0], dateFrom[2]];
              dateTo = [dateTo[1], dateTo[0], dateTo[2]];
              break;
            case "4": // DD/YYYY/MM
              dateFrom = [dateFrom[1], dateFrom[2], dateFrom[0]];
              dateTo = [dateTo[1], dateTo[2], dateTo[0]];
              break;
            case "5": // YYYY/MM/DD
              dateFrom = [dateFrom[0], dateFrom[1], dateFrom[2]];
              dateTo = [dateTo[0], dateTo[1], dateTo[2]];
              break;
            case "6": // YYYY/DD/MM
              dateFrom = [dateFrom[0], dateFrom[2], dateFrom[1]];
              dateTo = [dateTo[0], dateTo[2], dateTo[1]];
              break;
            default: // Assumes MM/DD/YYYY
              dateFrom = [dateFrom[2], dateFrom[0], dateFrom[1]];
              dateTo = [dateTo[2], dateTo[0], dateTo[1]];
          }

          // Adjust starting date
          var start = new Date(dateFrom)
          var diff = 7;
          for (index in daysMatch) {
            if (daysMatch[index]) {
              var diff = Math.min(diff,index - start.getDay());
              if (diff < 0) {
                diff += 7;
              }
            }
          }
          dateFrom[2] = parseInt(dateFrom[2]) + diff
          // pad to make 2 digit
          dateFrom[2] = dateFrom[2] > 9 ? "" + dateFrom[2]: "0" + dateFrom[2];

          // iCal fields
          comp.DTSTART = dateFrom[0] + dateFrom[1] + dateFrom[2] + 'T' + timeFrom.hour + timeFrom.minute + '00';
          comp.DTEND = dateFrom[0] + dateFrom[1] + dateFrom[2] + 'T' + timeTo.hour + timeTo.minute + '00';
          var DUNTIL = dateTo[0] + dateTo[1] + dateTo[2] + 'T' + timeTo.hour + timeTo.minute + '00';
          comp.RRULE = "FREQ=WEEKLY;UNTIL=" + DUNTIL + ";WKST=SU;BYDAY=" + daysOfWeek.join();
          comp.LOCATION = comp.location;
          comp.SUMMARY = course.code + ' ' + comp.type + ' in ' + comp.location;
          comp.DESCRIPTION = course.name + " in " + comp.location + " with " + comp.instructor;
          components[j] = comp;
        }
        data[i].components = components;
      }
      return data;
    }

    // Fetch courses
    var data = extractData(input);
    var courses = processData(data, datetype);

    return courses;
  }
  return {
    parseSchedule: parseSchedule
  };
});
