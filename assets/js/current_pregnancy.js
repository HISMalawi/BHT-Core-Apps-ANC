var tstCurrentDate = moment(sessionStorage.sessionDate).format("YYYY-MM-DD");

var patient_id = sessionStorage.patientID;

var programID = sessionStorage.programID;

var apiURL = sessionStorage.getItem("apiURL");

var apiPort = sessionStorage.getItem("apiPort");

var apiProtocol = sessionStorage.getItem("apiProtocol");

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patient_id;

var todayDate = new Date(tstCurrentDate);

var originaltestDate = ""

YesNoConcepts = {
  "yes" : 1065,
  "no" : 1066
}

var edod = "";

var gestation = "";

var alert_date = new Date(todayDate);

alert_date.setDate(alert_date.getDate()- 90);

var patient_age = parseInt(sessionStorage.patientAge);

var ageInMonths = patient_age * 12;

var currentYear = moment(tstCurrentDate).format("YYYY");

var currentMonth = moment(tstCurrentDate).format("MM");

var selected_stage_conditions = {};

var selected_stage_conditions_copy = {}

var firstPositiveHivTestType = "UNKNOWN";

var previous_hiv_test = false;

var keyboard;

var search;

var timedEvent;

var d = new Date(tstCurrentDate);

d.setDate(d.getDate() - 7);

var tstEstimatedLMPDate = d.getFullYear() + "-" + padZeros((d.getMonth() + 1),2) + "-" + padZeros(d.getDate(),2);

function getLocations(){

  var options = []

  select = $('planned_delivery_place')

  var locationsFile = new XMLHttpRequest();

  locationsFile.open("GET", "/apps/ANC/assets/data/locations.txt", false);

  locationsFile.onreadystatechange = function () {

    if(locationsFile.readyState === 4){

      if(locationsFile.status === 200 || locationsFile.status == 0){

        var allFacilities = locationsFile.responseText.split("\n");

        for(var i = 0; i < allFacilities.length; i++){

          option = document.createElement('option');

          option.setAttribute('value', allFacilities[i]);

          option.text = allFacilities[i];

          options.push("<option value='"+allFacilities[i]+"'>"+allFacilities[i]+"</option>");

          select.add(option);

        }

      }

    }

  }

  locationsFile.send(null);

}


function padZeros(number, positions){

  var zeros = parseInt(positions) - String(number).length;

  var padded = "";

  for(var i = 0; i < zeros; i++){

    padded += "0";

  }

  padded += String(number);

  return padded;

}

function calculateEDOD(){

  try{

    var month = ["Jan", "Feb", "Mar", 

    "Apr", "May", "Jun", 

    "Jul", "Aug", "Sep", 

    "Oct", "Nov", "Dec"];

    if(!$('expected_date_of_delivery')){
   
      var div = document.createElement("div");
   
      div.id = "expected_date_of_delivery";
   
      div.className = "statusLabel";

      $("inputFrame" + tstCurrentPage).appendChild(div);

    }

    gestation = "N/A";
    
    edod = "N/A";

    if($("touchscreenInput" + tstCurrentPage).value.trim().length > 0 &&
      $("touchscreenInput" + tstCurrentPage).value.trim() != "Unknown"){

        var theDate = new Date($("touchscreenInput" + tstCurrentPage).value.split("-").reverse().join("-"));

        theDate.setDate(theDate.getDate() + 7);

        var today = new Date(sessionStorage.sessionDate);

        var s = today - theDate;

        gestation = String(Math.floor(s / (24 * 60 * 60 * 7 * 1000)));

        __$("week_of_first_visit").value = gestation;

        theDate.setMonth(theDate.getMonth() + 9);

        edod = (theDate.getDate() + "-" + month[theDate.getMonth()] + "-" + theDate.getFullYear());

    }

    $("expected_date_of_delivery").innerHTML = "Expected Date Of Delivery: <i style='font-size: 1.2em; float: right;'>" +
        edod + "</i><br /><br />Gestation Weeks: " + (gestation < 32 &&
        gestation.trim().length > 0 ? "" : 
        (gestation > 42 && gestation.trim().length > 0 ? "<i style='color: red'>(Abnormal)</i>" : "")) +
        "<i style='font-size: 1.2em; float: right; width: 100px;'>" + gestation + "</i>";

    timedEvent = setTimeout('calculateEDOD()', 500);
   
  } catch(e){
   
    console.log(e);
   
  }
  
}

function checkHIVTestUnkown(){
  
  if($("new_test_result_at_current_facility").value.toLowerCase() == "not done"){

    showMessage("Patient needs to be tested now!", true);
  
    return true;
  
  }
  
  return false;
  
}

function checkLMP(){

  if(__$("lmp").value == "Unknown"){

    var value = __$("touchscreenInput" + tstCurrentPage).value;

    var range = {"0-12":6, "13-24":18, "25-28":26, "28+":29};

    var date = new Date();

    date.setDate(date.getDate() - (7 * range[value]) - 7);
    
    __$("lmp").value = (date.getFullYear() + "-" + padZeros((date.getMonth() + 1), 2) + "-" + padZeros(date.getDate(), 2));

  }

}

function setDate(period){

  currentDate = new Date(sessionStorage.sessionDate)

  var year = currentDate.getFullYear();

  var month = currentDate.getMonth();

  var day = currentDate.getDate();

  var d = new Date();


  d.setDate(parseInt(day));

  d.setYear(parseInt(year));

  d.setMonth(parseInt(month) - 1); 

  d.setMonth(d.getMonth() - parseInt(period));

  __$("lnmp").value = d.getFullYear() + "-" + padZeros((d.getMonth() + 1), 2) + "-" + padZeros(d.getDate(),2);

  __$("week_of_first_visit").value = Math.round(parseInt(period) * 30 / 7);

}

function initializeDate(){
    
  currentDate = new Date(sessionStorage.sessionDate)
  
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  year = currentDate.getFullYear()
  
  month = currentDate.getMonth();
  
  day = currentDate.getDate();

  setTimeout(__$("today").onmousedown, 0);

  setTimeout(function(){

    __$("touchscreenInput" + tstCurrentPage).value = "";

  }, 3);

  var year_plus = __$("dateselector_nextYear").onmousedown

  __$("dateselector_nextYear").onmousedown = function(){

    if(parseInt(year) <= parseInt(__$("dateselector_year").value)){

    }else{

      setTimeout(year_plus, 0);

    }

  }

  var month_plus = __$("dateselector_nextMonth").onmousedown

  __$("dateselector_nextMonth").onmousedown = function(){

    if((parseInt(year) <= parseInt(__$("dateselector_year").value)) && 

    (parseInt(month) <= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(month_plus, 0);

    }

  }

  var day_plus = __$("dateselector_nextDay").onmousedown

  __$("dateselector_nextDay").onmousedown = function(){

    if((parseInt(day) <= parseInt(__$("dateselector_day").value)) && 

    (parseInt(year) <= parseInt(__$("dateselector_year").value)) && 

    (parseInt(month) <= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(day_plus, 0);

    }

  }

}
  
function generateController(){
    
  html = "<table width='98%'><tr class='header'><td width='50%' align='center' style='background:#e0ffff;'>Bed Net</td><td width='50%' align='center' style='background:#e0ffff;'>Previous TTV Doses before this pregnancy</td></tr>";
  
  html += "<tr valign='top'><td width='50%'>";
  
  html += "<table><tr class='header'><td width='50%'>"
  
  html += "<ul width='100%'>";
  
  for (i = 0; i < bed_options.length; i++){
  
    html += '<li id="' + i + '_list" onClick="updateElement(' + i + ')" width="100%" value="' + bed_options[i] + '">' + bed_options[i] + '</li>';
  
  }
  
  html += "</ul></td></tr></table></td>";
  
  html += "<td><table><tr class='header' valign='top'><td>"
  
  html += "<input  size='10' type'text' id='previous_ttv' name='previous_ttv' class='header'/>";
  
  html += "</td></tr><tr><td><div id='keyboard'></div></td></tr></table></td></tr>";
  
  html += "</table>";
  
  document.getElementById('inputFrame'+tstCurrentPage).innerHTML = html
  
  initialise()
  
  updateElement(0)
  
}
  
function pressed(pressedChar){

  search = document.getElementById("previous_ttv")

  switch (pressedChar) {

    case 'backspace':

      search.value = search.value.substring(0,search.value.length-1);

      document.getElementById('tt statt_status_value').value = search.value

      return;
      
    case 'Space':
    
      search.value+= " "
    
      return
    
    case 'clear':
    
      search.value = ""

      return

    case 'num':

      showNumericKeypad();

      return

    case 'slash':

      if (search.name.match(/date/i)){

        return

      }

      search.value+= "/"

      return

    case 'dash':

      search.value+= "-"

      return
      
    case 'abc':
    
      showAlphaKeypad();
    
      return
    
    case 'enter':
    
      keyboard.style.display = "none";
    
      return
    
  }
  
  search.value+= pressedChar
  
  document.getElementById('tt_status_value').value = search.value

}

function initialise(){

  for (i = 1; i <= 9; i ++){

    ele = document.getElementById(i) 

    ele.setAttribute("onmousedown", "pressed(" + i + ")")

  }

  ele = document.getElementById("backspace")

  ele.setAttribute("onmousedown", "pressed('backspace')")

  ele = document.getElementById("zero")

  ele.setAttribute("onmousedown", "pressed('0')")

}

function updateElement(index){

  var x = 'even'

  var string = '' + index + '_list'

  for (i = 0; i < bed_options.length; i++){

    item = '' + i + '_list'

    if (x == 'even'){

      document.getElementById(item).style.backgroundColor = '#eee'

      x = 'old'

    } else{

      document.getElementById(item).style.backgroundColor = '#ddd'

      x = 'even'

    }

  }

  document.getElementById(string).style.backgroundColor = "lightblue"

  document.getElementById('bed_net').value = bed_options[index]

}

function getProgramWorkflowStates() {

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var apiPath = apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/programs/' + options.programId + '/workflows';

  GET({

    url: apiPath,

    async: true,

    headers: {

      'Authorization': options.authToken

    }

  }, {}, function (data) {

    options.success(data);

  }, function (error) {

    options.error(error);

  });

}

function getStateIdByName() {

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  getProgramWorkflowStates({

    programId: sessionStorage.programID,

    authToken: sessionStorage.authorization,

    success: function success(data) {

      var stateId = data[0].states.filter(function (state) {

        return state.concept.concept_names.every(function (concept_name) {

          return concept_name.name === options.stateName;

        });

      })[0].program_workflow_state_id;

      if (!stateId) {

        console.log(new Error('getStateIdByName: The passed state with name (' + options.stateName + '), does not exist.'));

      } else {

        options.success(stateId);

      }

    },

    error: function error(_error) {

      console.log(_error);

    }

  });

}

function createPatientState() {

  var apiPath = apiProtocol + '://' + apiURL + ':' + apiPort;
  apiPath += '/api/v1/programs/' + programID; 
  apiPath += '/patients/' + patient_id + '/states';

  getStateIdByName({

    stateName: "Currently in treatment",

    success: function success(stateId) {

      POST({

        url: apiPath,

        async: true,

        headers: {

          'Authorization': sessionStorage.authorization,

          'Content-Type': 'application/x-www-form-urlencoded'

        }

      }, {

        state: stateId

      }, function (data) {

        submitCurrentPregnancyEncounter();

      }, function (error) {

        console.log(error);

      });

    },
    error: function error(_error2) {

      console.log(_error2);

    }

  });

}

function enrollPatient() {

  var http = new XMLHttpRequest();

  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/patients/'+patient_id +"/programs/";

  var params = JSON.stringify({

    program_id: programID,

  });

  http.open('POST', url, true);

  http.setRequestHeader('Content-type', 'application/json');

  http.onreadystatechange = function () { //Call a function when the state changes.

    if (http.readyState == 4) {

      if (http.status == 201 || http.status == 409) {

        createPatientState();

      } else {

        console.log('error' + http.status);

      }

    }

  }

  http.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));

  http.send(params);

}

function submitCurrentPregnancyEncounter(){

  var currentTime = moment().format(' HH:mm:ss');

  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                        	
  var encounter = {

    encounter_type_name: 'CURRENT PREGNANCY',

    encounter_type_id:  81,

    patient_id: patient_id,

    encounter_datetime: encounter_datetime

  }

  submitParameters(encounter, "/encounters", "postCurrentPregnancyObs");

}

function postCurrentPregnancyObs(encounter){

  var obs = {

    encounter_id: encounter.encounter_id,

    observations: [

      { concept_id: 5596, value_datetime: moment(edod).format('YYYY-MM-DD').substr(1) },

      { concept_id: 7980, value_numeric: parseInt(gestation) },

      { concept_id: 968, value_datetime: $('lnmp').value.split("-").reverse().join("-") },

      { concept_id: 8397, value_text: $('planned_delivery_place').value },

      { concept_id: 2066, value_coded: YesNoConcepts[$('bed_net_available_for_use').value] },

      { concept_id: 7124, value_numeric: $('ttv_given').value }

    ]

  }

  if ($('bed_net_available_for_use').value === 'no') {

    obs.observations.push(

      { concept_id: 2723, value_coded: YesNoConcepts[$('bed_net_given').value] }

      )

  }

  submitParameters(obs, "/observations", "nextPage")

}

function changeSubmitFunction(){

  var nextButton = document.getElementById('nextButton');

  nextButton.setAttribute('onmousedown', 'enrollPatient()');

}

function nextPage(obs){

  nextEncounter(sessionStorage.patientID, sessionStorage.programID);

}

function addHereButton(){


  if (document.getElementById("addHere") === null){

    var button = document.createElement("button");
  
    button.id = "addHere";
  
    button.innerHTML = "<span>Here</span>";
  
    button.style.cssFloat = "right";
  
    button.onclick = function(){
    
      __$("touchscreenInput" + tstCurrentPage).value = sessionStorage.currentLocation;
  
    }
  
    if(__$("buttons")){
  
      __$("buttons").appendChild(button);
  
    }

  }

}

function removeHereButton(){

  if(__$("addHere")){

    __$("buttons").removeChild(__$("addHere"));

  }

}

function estimateDates(period){
  
  setDate(period);

  var month = ["Jan", "Feb", "Mar", 

    "Apr", "May", "Jun", 

    "Jul", "Aug", "Sep", 

    "Oct", "Nov", "Dec"];

  var theDate = new Date($("lnmp").value);//.split("-").reverse().join("-"));

  theDate.setDate(theDate.getDate() + 7);

  var today = new Date(sessionStorage.sessionDate);

  var s = today - theDate;

  gestation = String(Math.floor(s / (24 * 60 * 60 * 7 * 1000)));

  theDate.setMonth(theDate.getMonth() + 9);

  edod = (theDate.getDate() + "-" + month[theDate.getMonth()] + "-" + theDate.getFullYear());

}