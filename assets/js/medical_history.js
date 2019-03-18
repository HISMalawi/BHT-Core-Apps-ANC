var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var selectAll = false;

var medical_complications_obs = []

function submitMedicalHistoryEncounter() {

  var currentTime = moment().format(' HH:mm:ss');

  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 

  encounter_datetime += currentTime;

  var encounter = {

    encounter_type_name: 'MEDICAL HISTORY',

    encounter_type_id:  30,

    patient_id: patientID,

    encounter_datetime: encounter_datetime

  }

  submitParameters(encounter, "/encounters", "postMedicalCompObs");

}

function selectNone(){

  if (__$("chkSelectAll") && __$("lblSelectAll")){

    __$("lblSelectAll").innerHTML = "None";

    __$("chkSelectAll").src = "/public/touchscreentoolkit/lib/images/unticked.jpg";

    __$("chkSelectAll").onclick = function(){

      if ( __$("chkSelectAll").src.match(/unticked/))

        __$("chkSelectAll").src = "/public//touchscreentoolkit/lib/images/ticked.jpg";
        
      checkAll();
      
      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true")
      
      setTimeout("submitMedicalHistoryEncounter()", 200);
      
    }
    
    __$("lblSelectAll").onclick = function(){

      if ( __$("chkSelectAll").src.match(/unticked/))

        __$("chkSelectAll").src = "/public/touchscreentoolkit/lib/images/unticked.jpg";

      checkAll();

      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true");

      setTimeout("submitMedicalHistoryEncounter()", 200);

    }

  }

  setTimeout("selectNone()", 50);

}

function checkFields(){

  var nodes = __$("medical_complications").children;

  for (var i = 0; i < nodes.length; i ++){

    if (nodes[i].value != "none" && nodes[i] && nodes[i].innerHTML != ""){

      var id = nodes[i].value;

      var hash = {"concept_id": "", value_coded: ""}

      if (id && !__$('img' + (i-1)).src.match("unticked")){

        hash["concept_id"] = parseInt(id)

        hash["value_coded"] = 1065

        medical_complications_obs.push(hash);

        //__$(id).value = "Yes";

      }else if(id && __$('img' + (i-1)).src.match("unticked")){

        hash["concept_id"] = parseInt(id)

        hash["value_coded"] = 1066

        medical_complications_obs.push(hash);

        //  console.log("here")

      }

    }

  }

}

function postMedicalCompObs(encounter){

  checkFields();

  var obs = {

    encounter_id: encounter.encounter_id,

    observations: medical_complications_obs

  }; 

  submitParameters(obs, "/observations", "nextPage")

}

function nextPage(){

  nextEncounter(patientID, programID);

}

function submitFunction() {

  var nextButton = document.getElementById('nextButton');

  nextButton.innerHTML = '<span>Finish</span>';

  nextButton.setAttribute('onmousedown', 'submitMedicalHistoryEncounter()');

}

setTimeout("selectNone()", 50);