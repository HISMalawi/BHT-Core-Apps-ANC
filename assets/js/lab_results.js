var tstCurrentDate = moment(sessionStorage.sessionDate).format("YYYY-MM-DD");

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var authToken = sessionStorage.authorization;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

YesNoConcepts = {"Yes" : 1065,"No" : 1066};

var todayDate = new Date(tstCurrentDate);

var originaltestDate = ""
          
var alert_date = new Date(todayDate);

alert_date.setDate(alert_date.getDate()- 90)

var patient_age = parseInt(sessionStorage.patientAge);

var ageInMonths = patient_age * 12;

var currentYear = moment(tstCurrentDate).format("YYYY");

var currentMonth = moment(tstCurrentDate).format("MM");

var selected_stage_conditions = {};

var selected_stage_conditions_copy = {}
          
var firstPositiveHivTestType = "UNKNOWN";

var previous_hiv_test = false;

var hiv_status = "";

var prev_test_results = "";

var art_status = ""

var art_num = ""
    
var tested_here_before = "";

var subseq_visit = false;

var preg_test_done = false;

var concept_map = {
    "positive": 703,
    "negative": 664,
    "unknown": 1067,
    "inconclusive": 9436,
    "trace" : 6698
  }

var recency_essay = false;

var global_property = GlobalProperty({
  authToken: sessionStorage.authorization,
  path: apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1'
});

global_property.isEnabled('recency_essay_activated', function (predicate) {
  
  if (predicate) {

   recency_essay = true; 

  }

}, function (error) {

  console.error(error);

});

/**
* For ANC
*/
function askRecencyEssay(){

  return recency_essay

}

function isSubsequentVisit(){

  var url = 'http://'+apiURL+':'+apiPort+'/api/v1';
  url += '/programs/'+programID+'/patients/'+patientID+'/subsequent_visit';
  url += '?date='+sessionStorage.sessionDate;

  var xhttp = new XMLHttpRequest();
        
  xhttp.onreadystatechange = function () {
          
    if (this.readyState == 4 && this.status == 200) {
      
      try{

        var obj = JSON.parse(this.responseText);

        console.log(obj);

        subseq_visit = obj["subsequent_visit"];

        preg_test_done = obj["pregnancy_test"];

        prev_test_results = obj["hiv_status"];

      }catch(e){

        console.log(e);

      }
      
    }
        
  };
  
  xhttp.open("GET", url, true);
        
  xhttp.setRequestHeader('Authorization', authToken);
        
  xhttp.setRequestHeader('Content-type', "application/json");
        
  xhttp.send();

}

function getPatientHIVStatus(){
  
  var url = 'http://'+apiURL+':'+apiPort+'/api/v1';
  url += '/programs/'+programID+'/patients/'+patientID+'/art_hiv_status';

  var xhttp = new XMLHttpRequest();
        
  xhttp.onreadystatechange = function () {
          
    if (this.readyState == 4 && this.status == 200) {
            
      var obj = JSON.parse(this.responseText);
      
      hiv_status = obj['hiv_status'];
      
      art_status = obj['art_status']
    
      art_num = obj['arv_number']

      art_start_date = obj['arv_start_date']
          
    }
        
  };
  
  xhttp.open("GET", url, true);
        
  xhttp.setRequestHeader('Authorization', authToken);
        
  xhttp.setRequestHeader('Content-type', "application/json");
        
  xhttp.send();
      
}

getPatientHIVStatus();
isSubsequentVisit();

Object.defineProperty(Date.prototype, "format", {
  value: function (format) {
    var date = this;
    var result = "";

    if (!format) {
      format = ""
    }

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                      "October", "November", "December"];

    if (format.match(/YYYY\-mm\-dd/)) {

      result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth()) + 1), 2) + "-" + padZeros(date.getDate(), 2);

    } else if (format.match(/mmm\/d\/YYYY/)) {

      result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();

    } else if (format.match(/d\smmmm,\sYYYY/)) {

      result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();

    } else {

      result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();

    }

    return result;
  }

});

function checkHIVTestDate(){

  if(__$("previous_test_status_from_before_currrent_facility_visit").value == "Negative in the last 3 months"){
      
    var hiv_test_date_str = __$("touchscreenInput" + tstCurrentPage).value.replace(/-/g, '/');

    var hiv_test_date     = new Date(hiv_test_date_str);

    var today             = new Date(tstCurrentDate);

    var weeks_ago = parseInt((today.getTime()- hiv_test_date.getTime())/ (1000 * 60 * 60 * 24 * 7));

    if (weeks_ago > 12){

      showMessage("Patient needs to be tested again");

      return true;

    }
      
  }

  return false;

}

          
function getSelectedLabTests(){
    
  var lab_tests = "";

  if($('available_test_results')){

    for(var o = 0; o < $('available_test_results').options.length; o++){

      if($('available_test_results').options[o].selected == true){

        lab_tests += $('available_test_results').options[o].value + " ";

      }

    }

  }

  return lab_tests;

}

function getSelectedUrineTests(){

  var urine_tests = "";

  if($('available_urine_tests')){

    for(var o = 0; o < $('available_urine_tests').options.length; o++){

      if($('available_urine_tests').options[o].selected == true){

        urine_tests += $('available_urine_tests').options[o].value + " ";

      }

    }

  }

  return urine_tests;

}

function removeHIVOption(){
  
  var lab_test_list = $('available_test_results');
  
  var hiv_option = $('hiv');
  
  var prev_hiv_test_res = "";

  var hiv_test_date = "";

  var compare_dates = false;

  three_months_ago = moment(sessionStorage.sessionDate).subtract(90, "day").format("DD-MM-YYYY");

  if ($('prev_hiv_test_result')){
    
    prev_hiv_test_res = $('prev_hiv_test_result').value
  
  }

  try{
    
    prev_test_done = (yesNo_Hash["Lab Results"] !== undefined) ? yesNo_Hash["Lab Results"]["Previous HIV test done"] : "";

    if (prev_hiv_test_res !== ""){

      var hiv_test_date = $('prev_hiv_test_date').value.toString().split("-").reverse().join("-");

      three_months_ago = three_months_ago.toString().split("-").reverse().join("-");

      compare_dates = (new Date(hiv_test_date) > new Date(three_months_ago));

    }
    
    if ((prev_test_done !== undefined && prev_test_done.toLowerCase() === 'yes' && 
      prev_hiv_test_res.toLowerCase() === 'positive') || compare_dates || 
      (hiv_status !== null && hiv_status.toLowerCase() === 'positive') ||
      ((prev_test_results !== undefined && prev_test_results !== "") && prev_test_results.toLowerCase() === 'positive')){

      x = tt_currentUnorderedListOptions.firstChild.attributes["tstvalue"].value;

      if (x !== undefined && x === "hiv_status") {

        tt_currentUnorderedListOptions.firstChild.remove();

      }

      /** if (lab_test_list.length >= 6){

        lab_test_list.options[hiv_option.index] = null;

      }*/

    }
  
  }catch(e){
    
    console.log(e);
  
  }

}

function addHIVOption(){
  
  try{
    
    var hiv_option = $('hiv');
    
    if (!hiv_option){
      
      new_hiv_option = new Option('HIV', 'hiv', false, false);
      
      $('available_test_results').options[0] = new_hiv_option;
        
      new_hiv_option.setAttribute('id', 'hiv');
    
    }
  
  }catch(e){
   
   console.log(e);
  
  }

}

function updatePreviousHIVTestDoneResponse(){
        
  if ($('9655_yes') !== null && $('9655_yes').attributes.class.nodeValue.match(/\ clicked/)){
    
    previous_hiv_test = true;
  
  }else{
    
    previous_hiv_test = false;
  
  }

}

function checkPreviousHIVTest(){
  
  return previous_hiv_test;
  
}

function checkCondiditions(){

  if (subseq_visit && preg_test_done){

    return false;

  }else{

    return true;

  }

}

function checkVisit(){

  if (subseq_visit && preg_test_done){

    gotoNextPage();

  }

}

function addYesNoToLabTests() {
        
  var tar = document.getElementById("inputFrame" + tstCurrentPage);

  if (artHIVStatus() || subseq_visit){
  
    var attr = 'Pregnancy test done,3339'

  }else{
  
    var attr = 'Pregnancy test done,3339#Previous HIV test done,9655'

  }
        
        
  buildYesNoUI('Lab Results', attr, tar);
      
}


function addYesNoToAsanteTest() {
        
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  
  var attr = 'Line 1. Control Line Present,9658#Line 2. Positive Verification Line Present,9659#Line 3. Long-term Line Present, 9660'
        
        
  buildYesNoUI('Recency Assay', attr, tar);
      
}

function submitLabResultsEncounter() {
        
  var currentTime = moment().format(' HH:mm:ss');
        
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
        
  encounter_datetime += currentTime;
        
  var encounter = {
      encounter_type_name: 'LAB RESULTS',
      encounter_type_id: 32,
      patient_id: patientID,
      encounter_datetime: encounter_datetime
    }
    
  submitParameters(encounter,"/encounters/", "postLabResultsObs");
    
}

function postLabResultsObs(encounter) {
        
  var obs = {
   
    encounter_id: encounter.encounter_id,

    observations: []
    
  };

  if (prev_test_results !== undefined){

    tested_here_before = prev_test_results;
  
  }else{

    tested_here_before = "";

  }

  if (hiv_status !== null && 
    (tested_here_before !== null && tested_here_before.toLowerCase() !== "positive")){

    if(hiv_status !== "" && hiv_status.toLowerCase() === 'positive'){

      obs.observations.push(
        {concept_id: 9656, value_coded: concept_map[hiv_status.toLowerCase()]},
        { concept_id: 9655, value_coded: YesNoConcepts["Yes"]}
        );

    }

  }

  if (yesNo_Hash['Lab Results'] !== undefined){
      
    obs.observations.push(
      { concept_id: 2473, value_coded: YesNoConcepts[yesNo_Hash['Lab Results']['Pregnancy test done']] },
      { concept_id: 9655, value_coded: YesNoConcepts[yesNo_Hash['Lab Results']['Previous HIV test done']] }
    )
    // Getting previous HIV test Results
          
    if (yesNo_Hash['Lab Results']['Previous HIV test done'] === "Yes"){
            
      var previous_hiv_test_result = $('prev_hiv_test_result').value;
            
      var prev_hiv_test_date = $('prev_hiv_test_date').value.split("-").reverse().join("-");

      obs.observations.push(
          {concept_id: 9656, value_coded: concept_map[previous_hiv_test_result] },
          {concept_id: 9657, value_datetime: prev_hiv_test_date }
        );
          
      //Previous hiv test results is positive
        
      if(previous_hiv_test_result === 'positive'){
              
        var on_art = $('on_art').value
            
        var arv_number = $('arv_number').value 

        obs.observations.push(
            {concept_id: 7010, value_coded: YesNoConcepts[on_art]}
          );
            
        if(on_art === 'Yes' && arv_number !== ''){
            
          obs.observations.push({concept_id: 7014, value_text: arv_number});
      
        }

      }

    }

  }
  
  if($('hiv_status').value !== ""){
      
    obs.observations.push({concept_id: 3753, value_coded: concept_map[$('hiv_status').value]});

    if ($('hiv_status').value === "positive") {
            
      var on_art = $('on_art_1').value;

      if ($('touchscreenInput'+tstCurrentPage).name === "arv_number"){
          
        var arv_number = $('touchscreenInput'+tstCurrentPage).value;

      }else{
          
        var arv_number = $('arv_number_1').value;
 
      }

      obs.observations.push({concept_id: 7010, value_coded: YesNoConcepts[on_art]});

      if(on_art.toLowerCase() === 'yes' && arv_number !== ''){
            
        obs.observations.push({concept_id: 7014, value_text: arv_number});
      
      }

    }

  }

  if (yesNo_Hash["Recency Assay"] !== undefined){

    obs.observations.push(
      {concept_id: 9658, value_coded: YesNoConcepts[yesNo_Hash["Recency Assay"]["Line 1. Control Line Present"]]},
      {concept_id: 9659, value_coded: YesNoConcepts[yesNo_Hash["Recency Assay"]["Line 2. Positive Verification Line Present"]]},
      {concept_id: 9660, value_coded: YesNoConcepts[yesNo_Hash["Recency Assay"]["Line 3. Long-term Line Present"]]},

    )

  }
  
  if ($('touchscreenInput'+tstCurrentPage).name === "hb"){
          
    var hb = $('touchscreenInput'+tstCurrentPage).value;

  }else{
          
    var hb = $('hb').value;
 
  }

  if (hb !== "") {

      obs.observations.push(
        {concept_id: 7982, value_numeric: parseInt(hb) }
      );

    }
        
    if ($('syphilis').value !== "") {
        
      obs.observations.push(
        {concept_id: 7984, value_coded: concept_map[$('syphilis').value] }
        );

    }
        
    if ($('malaria').value !== "") {
          
      obs.observations.push(
        {concept_id: 9227, value_coded: concept_map[$('malaria').value] }
      );

    }
        
    if ($('blood_group').value !== "") {
          
      obs.observations.push(
        {concept_id: 300, value_text: $('blood_group').value }
      );

    }

    if ($('protein').value !== "") {
          
      obs.observations.push(
         {concept_id: 6447, value_text: $('protein').value }
       );

    }
        
    if ($('glucose').value !== "") {

      obs.observations.push(
        {concept_id: 887, value_text: $('glucose').value }
      );

    }
        
    if ($('wbc').value !== "") {

      obs.observations.push(
        {concept_id: 678, value_numeric: parseInt($('wbc').value) }
      );

    }
        
    if ($('rbc').value !== "") {

      obs.observations.push(
        {concept_id: 679, value_numeric: parseInt($('rbc').value) }
      );

    }
        
    if ($('nitrate').value !== "") {

      obs.observations.push(
        {concept_id: 9618, value_coded: concept_map[$('nitrate').value] }
      );

    }

    if (obs.observations.length === 0){
      obs.observations.push({"concept_id":7759, "value_text": sessionStorage.userLocation});
    }

    submitParameters(obs,"/observations/", "nextPage");

}

function nextPage(obs){
  
  iframe = document.getElementById("print-iframe");

  var url = "/programs/"+programID+"/patients/" + patientID + "/labels/lab_results?date=" + sessionStorage.sessionDate;
  
  url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1" + url;

  iframe.src = url;

  iframe.style.display = "block";

  document.getElementById("container").style.display = "none";
  //document.location = url;
  
  setTimeout('red();', 2000);
  
}

function red() {
  nextEncounter(sessionStorage.patientID, sessionStorage.programID);
}

function setAbsoluteMaxYear() {

  var y = document.getElementById('touchscreenInput' + tstCurrentPage);

  var maxYear = moment(sessionStorage.sessionDate).subtract(1, "day").format("DD-MM-YYYY");

  y.setAttribute('max', maxYear);

}

function checkMaxAndValue() {

  var yearInput = document.getElementById('touchscreenInput' + tstCurrentPage);

  var yearInputValue = yearInput.value;

  var maxValue = yearInput.max

  var inputDate = yearInputValue.toString().split("-").reverse().join("-");

  var maxDate = maxValue.split("-").reverse().join("-");

  if(inputDate.toLowerCase() !== "unknown" && inputDate > maxDate && inputDate !== 'Invalid date') {

    showMessage('Value bigger than maximum '+maxDate);

    return;
    
  }else {
      
    gotoNextPage();
  }

}

function submitButton(){
    
  var nextButton =  document.getElementById('nextButton');

  nextButton.onmousedown = function(){
    
    var ftype = document.getElementById('touchscreenInput' + tstCurrentPage).getAttribute('field_type');

    if (ftype !== null && ftype.toLowerCase() === 'date'){
        
      checkMaxAndValue();
   
    }else{
    
      gotoNextPage();

    }

  }

}

function changeSubmitFunction(){
        
  var nextButton =  document.getElementById('nextButton');
      
  var field = $("touchscreenInput"+tstCurrentPage);

  nextButton.onmousedown = function(){

    var selected_lab_values = getSelectedLabTests().split(" ").filter(Boolean);
          
    var selected_urine_values = getSelectedUrineTests().split(" ").filter(Boolean);
      
    // DO THIS WHEN CAPTURING ON ART ANSWER
    // WHY? Next page will be determined based on the answer to this question.
    //if (field.name === "on_art" || field.name === "arv_number"){
      
      //checkCurrentHIVResult();
      //return;

    //}

    if (selected_lab_values.length > 0){
            
      var field_name = $("touchscreenInput"+tstCurrentPage).name
    
      if (selected_lab_values[selected_lab_values.length - 1] === field_name || 
              
        selected_urine_values[selected_urine_values.length - 1] === field_name ){
              
          if (selected_lab_values[selected_lab_values.length - 1] === "urine"){
                
            if (selected_urine_values.length > 0){
                  
              if (selected_urine_values[selected_urine_values.length - 1] === field_name) {
                
                if (!inputIsValid()) return;
                
                submitLabResultsEncounter();
                
              }else{
                    
                if (!inputIsValid()) return;
                
                gotoNextPage();
                  
              }
            
            }else{
                  
              if (!inputIsValid()) return;
                
              submitLabResultsEncounter();
                
            }
          
          }else if (selected_lab_values[selected_lab_values.length - 1] === "hiv_status"){
              
            if (!inputIsValid()) return;
                
            checkCurrentHIVResult();
          
          }else{

            if (!inputIsValid()) return;
                
            submitLabResultsEncounter();
          
          }
        
      }else{

        if (!inputIsValid()) return;
                
        gotoNextPage();
        
      }
    
    }else{
        
      if (!inputIsValid()) return;
                
      submitLabResultsEncounter();
    
    }
  
  }

}

function hivRoute(){

  var nextButton =  document.getElementById('nextButton');
      
  nextButton.onmousedown = function (){
    checkCurrentHIVResult(); 
  }

}

function checkCurrentHIVResult(){

  var field = $("touchscreenInput"+tstCurrentPage);

  var selected_lab_values = getSelectedLabTests().split(" ").filter(Boolean);
          
  var selected_urine_values = getSelectedUrineTests().split(" ").filter(Boolean);

  if (field.name === "hiv_status" && field.value.toLowerCase() === "positive"){

    if (!inputIsValid()) return;

    gotoNextPage();

  }else if(field.name === "hiv_status" && field.value.toLowerCase() === "negative"){

    if(selected_lab_values.length > 1 || selected_urine_values.length > 0){

      if (!inputIsValid()) return;

      gotoNextPage();

    }else{
    
      if (!inputIsValid()) return;

      submitLabResultsEncounter();

    }

  }

  if (field.name === "on_art" && field.value.toLowerCase() === "yes"){

    if (!inputIsValid()) return;
    
    gotoNextPage();

  }else if(field.name === "on_art" && field.value.toLowerCase() === "no"){

    if(selected_lab_values.length > 1 || selected_urine_values.length > 0 || recency_essay){

      if (!inputIsValid()) return;

      gotoNextPage();
    
    }else{

      if(!inputIsValid()) return;

      submitLabResultsEncounter();

    } 

  }

  if (field.name === "arv_number"){

    if(selected_lab_values.length > 1 || selected_urine_values.length > 0 || recency_essay){

      if (!inputIsValid()) return;

      gotoNextPage();
    
    }else{

      if (!inputIsValid()) return;
      
      submitLabResultsEncounter();

    }

  }


  if (field.name === "recency-essay"){

    if (selected_lab_values.length > 1 || selected_urine_values.length > 0){

      if (!inputIsValid()) return;

      gotoNextPage();
    
    }else{

      if (!inputIsValid()) return;

      submitLabResultsEncounter();

    }  
    
  }

}

function hideCategory() {
        
  document.getElementById('category').style = 'display: none;'
      
}

function showARTSummary(){

  var displayText = "<div>"


  if (hiv_status.toLowerCase() === 'positive'){
  
    displayText += "HIV Status : <span class='value'>"+hiv_status.toUpperCase()+"</span><br />";

    if (art_status !== null && art_status.toLowerCase() === 'yes'){
    
      displayText += "On ART : &nbsp;&nbsp;&nbsp;&nbsp;<span class='value'>"+art_status.toUpperCase()+"</span><br />";

      if(art_start_date !== null){
            
        displayText += "ART Start Date : &nbsp;&nbsp;&nbsp;&nbsp;<span class='value'>"+art_start_date+"</span> <br />";

      }

      if (art_num !== null){
            
        displayText += "ARV Number : <span class='value'> "+ art_num.toString() +" </span> <br />";
            
      }

    }

  }
  
  document.getElementById('inputFrame'+tstCurrentPage).innerHTML = '<div id="summary">' + displayText + '</div>';   
      
}

function artHIVStatus(){

  
  if (hiv_status !== null && hiv_status.toLowerCase() === 'positive'){

    return true;

  }else{

    return false;

  }

}

function initializeDate(){
    
  currentDate = new Date(sessionStorage.sessionDate)
  
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  year = currentDate.getFullYear()
  
  month = currentDate.getMonth();
  
  day = currentDate.getDate();

  birthDate = new Date(sessionStorage.patientDOB);

  birth_year = birthDate.getFullYear();

  birth_month = birthDate.getMonth();

  birth_day = birthDate.getDate();



  setTimeout(__$("today").onmousedown, 0);

  setTimeout(function(){

    __$("touchscreenInput" + tstCurrentPage).value = "";

  }, 3);

  var year_plus = __$("dateselector_nextYear").onmousedown

  var year_minus = __$("dateselector_preYear").onmousedown

  __$("dateselector_nextYear").onmousedown = function(){

    if(parseInt(year) <= parseInt(__$("dateselector_year").value)){
      
      
    
    }else{

      setTimeout(year_plus, 0);

    }

  }

  __$("dateselector_preYear").onmousedown = function(){

    if(parseInt(birth_year) >= parseInt(__$("dateselector_year").value)){
      
      
    
    }else{

      setTimeout(year_minus, 0);

    }

  }

  var month_plus = __$("dateselector_nextMonth").onmousedown

  var month_minus = __$("dateselector_preMonth").onmousedown

  __$("dateselector_nextMonth").onmousedown = function(){

    if((parseInt(year) <= parseInt(__$("dateselector_year").value)) && 

    (parseInt(month) <= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(month_plus, 0);

    }

  }

  __$("dateselector_preMonth").onmousedown = function(){

    if((parseInt(birth_year) >= parseInt(__$("dateselector_year").value)) && 

    (parseInt(birth_month) >= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(month_minus, 0);

    }

  }

  var day_plus = __$("dateselector_nextDay").onmousedown

  var day_minus = __$("dateselector_preDay").onmousedown

  __$("dateselector_nextDay").onmousedown = function(){

    if((parseInt(day) <= parseInt(__$("dateselector_day").value)) && 

    (parseInt(year) <= parseInt(__$("dateselector_year").value)) && 

    (parseInt(month + 1) <= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(day_plus, 0);

    }

  }

  __$("dateselector_preDay").onmousedown = function(){

    if((parseInt(birth_day) >= parseInt(__$("dateselector_day").value)) && 

    (parseInt(birth_year) >= parseInt(__$("dateselector_year").value)) && 

    (parseInt(birth_month + 1) >= parseInt(months.indexOf(__$("dateselector_month").value) + 1))){

    }else{

      setTimeout(day_minus, 0);

    }

  }

}

function hideBackButton(){

  if (hiv_status === null || hiv_status === "" || hiv_status.toLowerCase() !== "positive"){

    $('backButton').style.display = 'none';

  }
  
}

function inputIsValid() {
  // don't leave current page if no value has been entered
  var ttInput = new TTInput(tstCurrentPage);
  var validateResult = ttInput.validate();
  var messageBar = __$("messageBar");
  messageBar.innerHTML = "";

  if (validateResult.length > 0 && !tstSearchPage) {
      var message = validateResult;

      if (ttInput.shouldConfirm) {

          messageBar.innerHTML += "<p>" + ((message.match(/^Value\s/))?(message.replace(/^Value\s/, "The value is ")):message) +
          ". Are you sure about this value?</p><div style='display: block;'>" +
          "<button class='button' style='float: none;' onclick='this.offsetParent.style.display=\"none\"; " +
          "gotoPage(tstCurrentPage+1, false);' onmousedown='this.offsetParent.style.display=\"none\"; " +
          "gotoPage(tstCurrentPage+1, false);'><span>Yes</span></button><button class='button' " +
          "style='float: none; right: 3px;' onmousedown='this.offsetParent.style.display=\"none\"; '>" +
          "<span>No</span></button>";

          messageBar.style.display = "block";

      } else {
          
        showMessage(message)
        
      }
      
      return false;
  
    }
  
  return true;

}
var x = setInterval(function(){

  var yesButton =  document.getElementById('yes_btn');

  if (yesButton == null){
    return;
  }

  yesButton.removeAttribute("onmousedown");

  yesButton.onmousedown = function(){

    clearInterval(x);

    var selected_lab_values = getSelectedLabTests().split(" ").filter(Boolean);
          
    var selected_urine_values = getSelectedUrineTests().split(" ").filter(Boolean);

    if (selected_lab_values.length > 0){
            
      var field_name = $("touchscreenInput"+tstCurrentPage).name
    
      if (selected_lab_values[selected_lab_values.length - 1] === field_name || 
              
        selected_urine_values[selected_urine_values.length - 1] === field_name ){
              
          if (selected_lab_values[selected_lab_values.length - 1] === "urine"){
                
            if (selected_urine_values.length > 0){
                  
              if (selected_urine_values[selected_urine_values.length - 1] === field_name) {
                
                submitLabResultsEncounter();
                
              }else{
                    
                gotoNextPage();
                  
              }
            
            }else{
                  
              submitLabResultsEncounter();
                
            }
          
          }else if (selected_lab_values[selected_lab_values.length - 1] === "hiv_status"){
              
            checkCurrentHIVResult();
          
          }else{

            submitLabResultsEncounter();
          
          }
        
      }else{

        gotoNextPage();
        
      }
    
    }else{
        
      submitLabResultsEncounter();
    
    }
  
  }
}, 200)

var yesButton =  document.getElementById('yes_btn');

if (yesButton !== null){
  clearInterval(x);
}

function checkPreEclampsiaCondition(){
  
  if (sessionStorage.referToUrineTest == "true"){
    urineTestAlert();
  }

}

function urineTestAlert(){
  var popUpBox = document.getElementById('ut-popup-div');
  var coverDIV = document.getElementById('ut-cover-div');

  if(coverDIV == undefined) {
    var coverDIV = document.createElement('div')
    coverDIV.setAttribute('id','ut-cover-div');
    var popUpBox = document.createElement('div')
    popUpBox.setAttribute('id','ut-popup-div');

    var hmtlBody = document.getElementsByTagName("body")[0];
    hmtlBody.appendChild(popUpBox);
    hmtlBody.appendChild(coverDIV);
  }

  coverDIV.style = 'display: inline;top: 0px;';
  popUpBox.style  = 'display: inline;top: 10px;';
  popUpBox.innerHTML = null;

  var message = "<p>Client is at risk of pre-eclampsia.</p>";
  message += "Select urine test to conduct urine protein test.";

  var p = document.createElement('p');
  p.innerHTML = message;
  cssText = 'text-align: center;color: red; font-weight: bold; font-size: 2.3em;';
  cssText += 'margin-top: 10%;';
  p.style = cssText;
  popUpBox.appendChild(p);

  /* ............... buttons ............................... */
  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popUpBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Remind later','Select Urine Test'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-red');
      buttonContainerCell.setAttribute('onmousedown','closeUTAlert();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','closeUTAlert();selectUrineTest();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

function closeUTAlert() {
  var div = document.getElementById('ut-popup-div')
  div.innerHTML = null;
  div.style = 'display: none;';
  document.getElementById('ut-cover-div').style = 'display: none;';
}

function selectUrineTest(){
  urine = __$("urine");
  id = (parseInt(urine.index) - 1);
  urine_test = __$(id);
  updateTouchscreenInputForSelect(__$('optionValue'+id), urine_test);
}

