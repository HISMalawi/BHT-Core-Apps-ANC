var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var past_visits = {}

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var latest_visit_number = 0;

setTimeout(function() {

  var url = 'http://'+apiURL+':'+apiPort+'/api/v1';
  url += '/programs/'+programID+'/patients/'+patientID+'/anc_visit';

  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){

    if (this.readyState == 4) {

      if (this.status == 200) {

        var results = JSON.parse(this.responseText);

        var numbers = results["visit_number"]

        if (numbers.length) {
          latest_visit_number = numbers[numbers.length - 1] 
        }
      }
    }
  };

  try {

    req.open('GET', url, true);

    req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));

    req.send(null);

  } catch (e) {
  
    console.log(e);

  }

}, 200);


//setTimeout(getAncVisitNumber(), 2000);

function submitVisitTypeEncounter(){
  if (!validateVisitNumber()){

    return;

  }

  var currentTime = moment().format(' HH:mm:ss');

  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 

  encounter_datetime += currentTime;

  var encounter = {

    encounter_type_name: 'ANC VISIT TYPE',

    encounter_type_id:  107,

    patient_id: patientID,

    encounter_datetime: encounter_datetime

  }

  submitParameters(encounter, "/encounters", "postVisitTypeObs");

}

function postVisitTypeObs(encounter){

  var anc_visit_number = $('touchscreenInput'+tstCurrentPage).value

  var obs = {

    encounter_id: encounter.encounter_id,

    observations: [

      { concept_id: 6189, value_numeric: anc_visit_number }

    ]

  };

  submitParameters(obs, "/observations", "nextPage")

}

function validateVisitNumber(){

  var visit_number = $('touchscreenInput'+tstCurrentPage).value;

  if (visit_number === ""){

    showMessage("Please enter value");

    return false;

  }

  if (!(/^[0-9]+$/.test(visit_number))){

    showMessage("Please enter a valid number to continue.");

    return false;
  }

  if (parseInt(visit_number) <= latest_visit_number || parseInt(visit_number) > 12){
    
    showMessage("Visit number out of range: (" + (latest_visit_number + 1) + " - 12)");

    return false;

  }

  return true;

}

function submitFunction() {

  var nextButton = document.getElementById('nextButton');

  nextButton.innerHTML = '<span>Finish</span>';

  nextButton.setAttribute('onmousedown', 'submitVisitTypeEncounter()');

}

function nextPage(){

  nextEncounter(sessionStorage.patientID, sessionStorage.programID);

}
