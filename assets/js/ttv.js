var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var YesNoConcepts = {"Yes": 1065,"No": 1066};

var ttv_order_id = "";

function submitTreatmentEncounter() {
  
  var currentTime = moment().format(' HH:mm:ss');
  
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;

  // Gets input value
  response = yesNo_Hash['DISPENSING']['TTV has been given today'];
  
  //Validates the input
  if (response === undefined || response === null) {
    
    showMessage('Please select all selection(s) either yes or no.');
    
    return;
  
  }
  
  if (response.toLowerCase() === "no"){
    
    submitDispenseEncounter()
  
  }else if (response.toLowerCase() === "yes"){
  
    var encounter = {
        
      encounter_type_name: 'TREATMENT',
      
      encounter_type_id:  25,
      
      patient_id: patientID,
      
      encounter_datetime: encounter_datetime
    
    }

    submitParameters(encounter, "/encounters", "postDrugOrders");
  
  }

}

function postDrugOrders(encounter){

  var drug_orders_params = {
    encounter_id: encounter.encounter_id, 
    
    drug_orders: [
    
      {
        drug_inventory_id: 609,
        dose: 0.5,
        equivalent_daily_dose: 0.5,
        frequency: "Once a day (od)",
        start_date: sessionStorage.sessionDate,
        auto_expire_date: sessionStorage.sessionDate,
        instructions: "Once a day",
        units: "ml"
      }
    
    ]

  }

  submitParameters(drug_orders_params, "/drug_orders", "submitDispenseEncounter");

}

function submitDispenseEncounter(drugOrders){
  
  response = yesNo_Hash['DISPENSING']['TTV has been given today'];
  
  var currentTime = moment().format(' HH:mm:ss');
  
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;

  var encounter = {
        
    encounter_type_name: 'DISPENSE',
    
    encounter_type_id:  54,
    
    patient_id: patientID,
    
    encounter_datetime: encounter_datetime
    
  }

  if (response.toLowerCase() === "yes"){
    
    ttv_order_id = drugOrders[0].order_id;
    
    submitParameters(encounter, "/encounters", "updateDrugOrder");
  
  }else if (response.toLowerCase() === "no"){
    
    submitParameters(encounter, "/encounters", "postTTVObs");
  
  }

}

function updateDrugOrder(){
  
  var drug_order = {
    
    dispensations: [
      {date: sessionStorage.sessionDate, drug_order_id: ttv_order_id,quantity: 1}
    ]
  
  }
  
  submitParameters(drug_order, "/dispensations", "nextPage");

}

function postTTVObs(encounter){
  
  var obs = {
    
    encounter_id: encounter.encounter_id,
    
    observations: [{ concept_id: 7124, value_text: "Not dispensed" }]
  
  };
  
  submitParameters(obs, "/observations", "nextPage");

}

function nextPage(obs){
  
  nextEncounter(patientID, programID);

}

function addYesNo() {

  var tar = document.getElementById("inputFrame" + tstCurrentPage);

  var attr = 'TTV has been given today'

  buildYesNoUI('DISPENSING', attr, tar);

}

function submitFunction() {

  var nextButton = document.getElementById('nextButton');

  nextButton.innerHTML = '<span>Finish</span>';

  nextButton.setAttribute('onmousedown', 'submitTreatmentEncounter()');

}