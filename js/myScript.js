var termReg = /(Spring|Summer|Fall|Winter)\s+(\d{4})\s+\|\s+([a-zA-Z]+)\s+\|\s+(.+)/;
var courseReg = /([A-Z]{2,}\ \w{1,5})\ -\ ([\w\ ]+)/;
var compReg = "Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date";
var daysOfWeekRe = /^(Mo|M)?(Tu|T)?(We|W)?(Th)?(Fr|F)?(Sa)?(Su)?\s([\d\D]+)/
var rangeRe = /([\d\D]+)\s-\s([\d\D]+)/

function parseSchedule(data){
  var state = 1;  //1: finding term info
                  //2: finding course info
                  //3: finding course components
  var lines = data.split('\n');
  var courses = [];

  for(var i = 0;i < lines.length;i++){
    var l = lines[i];
    if(/\S/.test(l)){ // string is not empty and not just whitespace
      if(state == 1){ // finding term info
        var termMatch = l.match(termReg);
        if (termMatch) {
          var term = termMatch[1];
          var year = termMatch[2];
          var level = termMatch[3];
          var school = termMatch[4];
          state=2;
          console.log({term:term,year:year,level:level,school:school})
        }
      }else if(state == 2){ // finding course title
        // Regexes modified from:
        // https://github.com/vikstrous/Quest-Schedule-Exporter/blob/master/index.php
        var courseMatch = l.match(courseReg)
        if (courseMatch) {
          var code = courseMatch[1];
          var name = courseMatch[2];
          state=3;
          courses.push({code:code,name:name, components:[]});
        }
      }else if (state == 3) { // finding component info
        var componentMatch = l.match(compReg)
        if(componentMatch){
          var classNbr = lines[++i];
          var section = lines[++i];
          var type = 	lines[++i];
          var timeRaw =lines[++i];
          var location = lines[++i];
          var instructor = lines[++i];
          var dateRaw = lines[++i];
          var val = courses[courses.length - 1];
          val.components.push({classNbr:classNbr,section:section,type:type,timeRaw:timeRaw,location:location,instructor:instructor,dateRaw:dateRaw})
          //console.log(courses);
          //Peek next line to see if we have all components for this course
          var nl = lines[i+1];
          if (!nl.match(/^\d{4,}$/)){
            state = 2;
          }
        }
      }
    }
  }
  return courses;
}

function myFunction(){

  var courses = [];

  // Fetch courses
  var data = document.getElementById('myInput').value;
  courses = parseSchedule(data);
  console.log(courses)

  // Clean up date&time
  for(var i =0; i< courses.length;i++){
    var components = courses[i].components;
    for(var j=0; j<components.length;j++){
      var comp = components[j];

      var daysMatch = comp.timeRaw.match(daysOfWeekRe);
      comp.daysOfWeek = daysMatch.slice(1,8);

      var timeMatch = daysMatch[8].match(rangeRe);
      comp.timeFrom = timeMatch[1];
      comp.timeTo = timeMatch[2];

      var dateMatch = comp.dateRaw.match(rangeRe);
      comp.dateFrom = dateMatch[1];
      comp.dateTo = dateMatch[2];

      components[j] = comp;
    }
    courses[i].components = components;
  }
  console.log(courses)

}

document.getElementById('myButton').onclick = function(){myFunction()}
