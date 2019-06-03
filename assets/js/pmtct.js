var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

YesNoConcepts = {};

YesNoConcepts = {"Yes" : 1065, "No" : 1066 };

function submitARTFollowUpEncounter() {
  
  var currentTime = moment().format(' HH:mm:ss');
  
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                    
  var encounter = {
    
    encounter_type_name: 'ART_FOLLOWUP',
    
    encounter_type_id:  10,
    
    patient_id: patientID,
    
    encounter_datetime: encounter_datetime
  
  }

  submitParameters(encounter, "/encounters", "postARTFollowUpObs");

}

function postARTFollowUpObs(encounter) {

  var res = yesNo_Hash["PMTCT"]["Proceed to PMTCT"];

  var obs = {
    
    encounter_id: encounter.encounter_id,
    
    observations: []
  
  }; 

  if (res.toLowerCase() === "yes"){
   
    // Yes to pmtct  
    obs.observations.push(
      { concept_id: 1939, value_coded: parseInt(YesNoConcepts[res]) },
    );

    sessionStorage.setItem("switchedFromANC",true);

  }else if(res.toLowerCase() === "no" && $('reason_for_not_starting_art').value !== ""){
    // No to pmtct 
    obs.observations.push(
      { concept_id: 1939, value_coded: parseInt(YesNoConcepts[res]) },
      { concept_id: 1811, value_text: $('reason_for_not_starting_art').value }
    );

  }

  submitParameters(obs, "/observations", "nextPage")  

}

function nextPage(obs){
  var pmtct = yesNo_Hash["PMTCT"]["Proceed to PMTCT"];
  
  if (pmtct.toLowerCase() === "yes"){
    nextEncounter(patientID, programID);
  }else if(pmtct.toLowerCase() === "no"){

    window.location.href = "/views/patient_dashboard.html?patient_id=" + sessionStorage.patientID;
    return;

  }

}

function addYesNo() {
  
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  
  var attr = 'Proceed to PMTCT'
  
  buildYesNoUI('PMTCT', attr, tar);

}

function changeSubmitFunction(){
  
  $('nextButton').onmousedown = function(){
    
    response = yesNo_Hash["PMTCT"]["Proceed to PMTCT"];
    
    if(response == null){
      
      showMessage('Please complete selection by clicking Yes / No');
      
      return;
    
    }

    if (response == 'No'){
      
      gotoNextPage();
    
    }else if (response == 'Yes'){
      
      // Proceed to ART Application
      
      submitARTFollowUpEncounter();

    }
  
  }

}

function submitFunction(){
  
  $('nextButton').onmousedown = function(){
    
    reason = $('reason_for_not_starting_art').value;
    
    if (reason === '' || reason === null) {
      
      showMessage("You must enter a value to continue");
      
      return;
    
    }
    
    submitARTFollowUpEncounter();
  
  }

}