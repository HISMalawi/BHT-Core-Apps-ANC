var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

YesNoConcepts = {};

YesNoConcepts["Yes"] = 1065;

YesNoConcepts["No"] = 1066;

concept_hash = {
  "Yes":1065,
  "No":1066,
  "alcohol":3340,
  "smoker":3339,
  "civil_status":1054,
  "Never Married":1057,
  "Married":5555,
  "Separated":1056,
  "Divorced": 1058
}

var validationInterval = '';

var observations = [];

var social_history = {};

function submitSocialHistoryEncounter() {
  
  var currentTime = moment().format(' HH:mm:ss');
  
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                    
  var encounter = {
    
    encounter_type_name: 'SOCIAL HISTORY',
    
    encounter_type_id:  84,
    
    patient_id: patientID,
    
    encounter_datetime: encounter_datetime
  
  }

  submitParameters(encounter, "/encounters", "postSocialHistoryObs");

}

function postSocialHistoryObs(encounter) {

  var obs = {
    
    encounter_id: encounter.encounter_id,
    
    observations: []
  
  };
  
  for(key in social_history){

    obs.observations.push({concept_id: key, value_coded: concept_hash[social_history[key]]});

  }

  submitParameters(obs, "/observations", "nextPage")  

}

function nextPage(obs){
  var url = "/programs/"+programID+"/patients/" + patientID + "/labels/history"
  url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1" + url;
  document.location = url;
  
  setTimeout('red();', 2000);
  
}

function red() {
  nextEncounter(sessionStorage.patientID, sessionStorage.programID);
}

function addYesNo() {
  
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  
  var attr = 'Patient currently smokes?,3339#Patient currently takes alcohol?,3340'
  
  buildYesNoUI('Social History', attr, tar);

}

function submitFunction() {

  var nextButton = document.getElementById('nextButton');

  nextButton.innerHTML = '<span>Finish</span>';

  nextButton.setAttribute('onmousedown', 'submitSocialHistoryEncounter()');

}

function appendMaritalStatus(){

  var select = document.createElement('select');

  var div = document.createElement('div');

  div.setAttribute("id", "inputFrame1");

  div.setAttribute("class", "inputFrameClass");

  select.setAttribute("helpText", "Marital status");

  select.setAttribute("name", "Marital status");

  select.setAttribute("id", "marital_statue");

  select.setAttribute("allowFreeText","false")

  select.setAttribute("helpText","Marital status")

  select.setAttribute("tt_onLoad","__$('nextButton').style.display='block';submitFunction();")

  var statusTable = document.createElement("table");

  statusTable.setAttribute("class","yes_no_table");

  var r1 = document.createElement("tr");

  td11 = document.createElement("td");

  td11.innerHTML = "Marital status";

  r1.appendChild(td11);

  statusTable.appendChild(r1);

  var options = [["1057","Never married"],
    ["5555", "Married"],
    ["1056", "Separated"],
    ["1058", "Divorced"]]

  empty_option = document.createElement('option');
  
  select.appendChild(empty_option);

  for (var i = 0; i < options.length; i++) {

    option = document.createElement('option');

    option.value = options[i][0];

    option.textContent = options[i][1];

    select.appendChild( option );

  }

  td12 = document.createElement("td");

  td12.append(select)

  r1.appendChild(td12);

  statusTable.appendChild(r1)

  div.appendChild(statusTable);

  $('page'+tstCurrentPage).appendChild(div);

}

function loadSplitSelections(arr){

  //array format [url, input_id, helpText]

  var options = ["Yes", "No"].join('|')

  var marital_status = ["Never Married","Married","Separated","Divorced"].join('|')

  var religion =["None", "Christian", "Jehova witness", "Muslim", "Hindu", "African traditional", "Other"].join("|");

  var arr = [[options, "smoker"],

    [options, "alcohol"],

    [marital_status, "civil_status"],

    [religion, "religion"]

  ];


  var count = arr.length;

  var n = Math.floor(Math.sqrt(count));

  var v_count = Math.ceil(count/n);

  var h_count = Math.ceil(count/n);

  var e_count = count % n;


  __$("keyboard").style.display = "none";

  __$("touchscreenInput" + tstCurrentPage).style.display = "none";

  __$("inputFrame" + tstCurrentPage).style.height = (0.72 * screen.height) + "px";

  __$("inputFrame" + tstCurrentPage).style.marginTop = (0.05 * screen.height) + "px";

  //__$("inputFrame" + tstCurrentPage).style.background = "lightblue";


  if (count > 0){

    var n = 0;

    var holder = document.createElement("div");

    holder.id = 'holder';

    holder.style.height =  (0.72 * screen.height) + "px";

    holder.style.width = "100%";

    holder.style.display = "none";

    holder.setAttribute("class", "options");

    holder.style.borderRadius = "5px";

    holder.style.background = "white";

    __$("inputFrame" + tstCurrentPage).appendChild(holder);


    for (var r = 1; r <= v_count; r ++){

      var row = document.createElement("div");

      row.id = r;

      row.style.display = "table-row";

      row.setAttribute("class", "row");

      holder.appendChild(row);


      for(var c = 1; c <= h_count; c ++){

        var cell = document.createElement("div");

        cell.id = r + "_" + c;
    
        cell.style.display = "table-cell";
    
        cell.setAttribute("class", "cell");
    
        cell.style.background = "white";


        var helpText = __$(arr[n][1]).getAttribute("helpText");

        var heada = document.createElement("div");

        heada.style.height = "40px";

        heada.innerHTML = helpText;

        heada.style.marginTop = "5px";

        heada.style.background = "#CFE4CD";

        heada.style.borderRadius = "3px";

        heada.style.border = "2px gray solid";

        heada.style.fontSize = "28px";

        heada.style.marginLeft = "5px";

        heada.style.marginRight = "5px";

        if (__$(arr[n][1]).getAttribute("helpText") != "Religion"){
      
          cell.appendChild(heada);
    
        }
    

        if(c != 1){
      
          cell.style.borderLeft = "1px solid";
    
        }

        if(r != 1){
      
          cell.style.borderTop = "1px solid";
    
        }

        cell.style.height = ((72/v_count) - 2) * 0.001 * screen.height + "px";

        cell.style.width = ((100/h_count)) + "%";

        row.appendChild(cell);

        n ++;

        if (n != arr.length - 1){

          handleResultData(arr[n - 1][0], arr[n - 1][1], "", (r + "_" + c));

        }else{

          handleResultData(arr[n - 1][0], arr[n - 1][1], "table", (r + "_" + c));

        }

      }

    }

    __$("2_2").style.borderLeft = "hidden";

    __$("2_2").style.borderTop = "hidden";

    __$("1_2").style.borderBottom = "1px solid";

    __$("2_1").style.borderRight = "1px solid";


    __$("2_2").style.display = "none";


  }
}

function handleResultData(result, id, n, dom_id) {

  var data = result.split('|');


  var ul = document.createElement("ul");

  ul.style.paddingLeft = "5px";

  ul.style.paddingRight = "5px";

  for(var i = 0; i < data.length; i ++){

    var li = document.createElement("li")

    li.setAttribute("class", "cell-data");

    li.setAttribute("target", id);

    li.value = data[i];

    li.setAttribute("value", data[i]);     

    li.innerHTML =  "<img height=34 style='margin-right: 10px; margin-bottom: -5px;' src='/public/touchscreentoolkit/lib/images/unchecked.png' />" + data[i];

    li.onmousedown = function(){

      if (social_history[concept_hash[this.getAttribute('target')]] == undefined){

        social_history[concept_hash[this.getAttribute('target')]] = "";

      }

      social_history[concept_hash[this.getAttribute('target')]] = this.getAttribute("value");

      updateTouchscreenInput(this);


      var target = this.getAttribute("target")

      var nodes = jQuery("[target=" + target + "]");

      for (var i = 0; i< nodes.length; i++){

        nodes[i].getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/unchecked.png';
      
      }

      this.getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/checked.png';
    }

    if(i % 2 == 0){

      li.className = "even";
  
      li.setAttribute("group", "even");


    } else {

      li.className = "odd";

      li.setAttribute("group", "odd");

    }


    ul.appendChild(li);

  }

  __$(dom_id).appendChild(ul);

  if (n == "table")

    setTimeout(function(){
  
      __$('holder').style.display = n;

    }, 350);

}

function showMsg(div){

  setTimeout(function(){fadeOut(div, 0);}, 1);

}

function addValidationInterval(){

  var interval = setInterval(function(){

    var arr = ["smoker", "alcohol", "civil_status"];

/**
    var check = 0

    for (var i = 0; i < arr.length; i ++){

      var node = __$(arr[i]);

      if (node != undefined && node.value == ""){

        check = check + 1;

      }

    }
*/

    if (Object.keys(social_history).length < arr.length){

      __$("nextButton").onmousedown = function(){

        showMessage("Select all fields to proceed");

      }

    }else{

      __$("nextButton").onmousedown = function(){

        submitSocialHistoryEncounter();

      }

    }

  }, 100);

  return interval;

}