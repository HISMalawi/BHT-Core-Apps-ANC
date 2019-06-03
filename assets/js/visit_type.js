var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var past_visits = "";

if (sessionStorage.ancVisitNumbers !== "null" && 
  sessionStorage.ancVisitNumbers !== "" && 
  sessionStorage.ancVisitNumbers !== "undefined"){

  past_visits = sessionStorage.ancVisitNumbers.split(",")

}


function disablePastVisits(){

  for(var i = 0; i < past_visits.length; i++){

    if(__$(past_visits[i])){

      __$(past_visits[i]).className = "keyboardButton gray";

      __$(past_visits[i]).onmousedown = function(){}

    }

  }

}

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

  if (parseInt(visit_number) > 12){
    
    showMessage("Visit number out of range: (1 - 12)");

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
