var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");
      
var apiProtocol = sessionStorage.apiProtocol;
      
var apiURL = sessionStorage.apiURL;
      
var apiPort = sessionStorage.apiPort;
      
var patientID = sessionStorage.patientID;
      
var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var selectAll = false;

var surgical_obs = []

var gravida = 0;


function getGravida() {

  var url = 'http://'+apiURL+':'+apiPort+'/api/v1';
  url += '/programs/'+programID+'/patients/'+patientID+'/anc_visit';

  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){

    if (this.readyState == 4) {

      if (this.status == 200) {

        var results = JSON.parse(this.responseText);

        gravida = JSON.stringify(results["gravida"]);
      }else {

        gravida = 0;

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

}

getGravida();

function hideSurgeries(){

  if (parseInt(gravida) === 1){
    // Hide surgeries associated with pregnacy
    $('tt_currentUnorderedListOptions').removeChild($("1"));
    $('2').className = "odd";
    $('tt_currentUnorderedListOptions').removeChild($("3"));
    $('tt_currentUnorderedListOptions').removeChild($("5"));
    $('6').className = "odd";
    $('7').className = "even";
    $('8').className = "odd";
    $('9').className = "even";
    $('10').className = "odd";
    $('11').className = "even";
    $('12').className = "odd";
    $('13').className = "even";
    $('14').className = "odd";
    $('15').className = "even";
    $('tt_currentUnorderedListOptions').removeChild($("17"));
    $('16').className = "odd";
    $('tt_currentUnorderedListOptions').removeChild($("23"));
    $('tt_currentUnorderedListOptions').removeChild($("24"));
    $('tt_currentUnorderedListOptions').removeChild($("38"));
    $('39').className = "even";
    $('40').className = "odd";
    $('41').className = "even";
    $('tt_currentUnorderedListOptions').removeChild($("42"));
    $('tt_currentUnorderedListOptions').removeChild($("43"));
    $('tt_currentUnorderedListOptions').removeChild($("44"));
    $('tt_currentUnorderedListOptions').removeChild($("46"));
    $('47').className = "even";
  
  }else{

    return true;

  }

}


function submitSurgicalHistoryEncounter() {

  var currentTime = moment().format(' HH:mm:ss');

  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 

  encounter_datetime += currentTime;
                        	
  var encounter = {
          
    encounter_type_name: 'SURGICAL HISTORY',
    
    encounter_type_id:  83,
    
    patient_id: patientID,
    
    encounter_datetime: encounter_datetime
    
  }
  
  submitParameters(encounter, "/encounters", "postSurgicalObs");
  
}
  
function selectNone(){

  if (__$("chkSelectAll") && __$("lblSelectAll")){

    __$("lblSelectAll").innerHTML = "None";

    $('chkSelectAll').src = "/public/touchscreentoolkit/lib/images/unticked.jpg";

    __$("chkSelectAll").onclick = function(){

      if ( __$("chkSelectAll").src.match(/unticked/))

        __$("chkSelectAll").src = "/public/touchscreentoolkit/lib/images/ticked.jpg";

      checkAll();

      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true")

      setTimeout("submitSurgicalHistoryEncounter()", 200);

    }

    __$("lblSelectAll").onclick = function(){

      if ( __$("chkSelectAll").src.match(/ticked/))

        __$("chkSelectAll").src = "/public/touchscreentoolkit/lib/images/unticked.jpg";

      checkAll();

      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true");

      setTimeout("submitSurgicalHistoryEncounter()", 200);

    }

  }

  setTimeout("selectNone()", 50);

}

function checkFields(){

  var nodes = __$("surgical_history").children;

  for (var i = 0; i < nodes.length; i ++){

    if (nodes[i].value != "none" && nodes[i] && nodes[i].innerHTML != ""){

      var id = nodes[i].value;

      var hash = {"concept_id": "", value_coded: ""}

      try{

        if (id && !__$('img' + (i-1)).src.match("unticked")){

          hash["concept_id"] = parseInt(id)

          hash["value_coded"] = 1065

          surgical_obs.push(hash);

        }

      }catch(e){

      }
    }

  }

}

function postSurgicalObs(encounter){

  checkFields();

  if (surgical_obs.length == 0){

    // Provide workstation location in case
    // where surgical history is none.

    
    surgical_obs = [{"concept_id":7439, "value_text": "None"}];
        
  }

  var obs = {

    encounter_id: encounter.encounter_id,

    observations: surgical_obs

  }; 

  submitParameters(obs, "/observations", "nextPage")

}

function nextPage(){

  nextEncounter(patientID, programID);

}

function submitFunction() {

  var nextButton = document.getElementById('nextButton');

  nextButton.innerHTML = '<span>Finish</span>';

  nextButton.setAttribute('onmousedown', 'submitSurgicalHistoryEncounter()');

}

setTimeout("selectNone()", 50);