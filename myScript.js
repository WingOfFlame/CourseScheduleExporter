function myFunction(){
  var state = 1;  //1: finding term info
                  //2: finding
  var courses = [];

  var lines = document.getElementById('myInput').value.split('\n');
  for(var i = 0;i < lines.length;i++){
    var l = lines[i];
    if(/\S/.test(l)){ // string is not empty and not just whitespace
      if(state == 1){ // finding term info
        var termMatch = l.match(/(Spring|Summer|Fall|Winter)\s+(\d{4})\s+\|\s+([a-zA-Z]+)\s+\|\s+(.+)/);
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
        var courseMatch = l.match(/([A-Z]{2,}\ \w{1,5})\ -\ ([\w\ ]+)/)
        if (courseMatch) {
          var code = courseMatch[1];
          var name = courseMatch[2];
          state=3;
          courses.push({code:code,name:name, components:[]});
          console.log(courses)
        }
      }else if (state == 3) { // finding component info
        var componentMatch = l.match("Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date")
        if(componentMatch){
          var classNbr = lines[++i];
          var section = lines[++i];
          var type = 	lines[++i];
          var date =lines[++i];
          var location = lines[++i];
          var instructor = lines[++i];
          var range = lines[++i];
          var val = courses[courses.length - 1];
          val.components.push({classNbr:classNbr,section:section,type:type,date:date,location:location,instructor:instructor,range:range})
          console.log(courses);
        }

      }

    }
  }
}

document.getElementById('myButton').onclick = function(){myFunction()}
