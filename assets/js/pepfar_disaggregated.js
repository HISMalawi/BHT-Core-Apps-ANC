var window_href = window.location.href;

window_url = new URL(window_href);

var start_date = window_url.searchParams.get("start_date");

var end_date = window_url.searchParams.get("end_date");

var apiProtocol = sessionStorage.apiProtocol;

var apiPort = sessionStorage.apiPort;

var apiURL = sessionStorage.apiURL;

var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";

var decompose_url = "/apps/ANC/views/reports/decompose.html?ids=";

  var age_category = ["<10", "10-14", "15-19",
    "20-24", "25-29", "30-34", "35-39", "40-49",
    "50+", "Unknown", "All"];

var indicators = ["Already on ART", "Known at entry positive",
    "Known status", "New ANC client", "Newly identified negative",
    "Newly identified positive", "Newly on ART"];

var quarter = "pepfar";

var gender = ["Male", "Female"];

var months = {0: "January", 1: "February",
    2: "March",3: "April",4: "May",5: "June",
    6: "July",7: "August",8: "September",
    9: "October",10: "November",11: "December"}

var monthdiff = monthDiff(new Date(start_date), new Date(end_date));

var table = null;
  
var count = 1;

var district = "";

$(document).ready(function(){

  $('#site_name').html(sessionStorage.currentLocation);
  
  $('#start_date').html(moment(start_date).format("MMM YYYY"));
  
  $('#end_date').html(moment(end_date).format("MMM YYYY"));

  $.getJSON("/apps/ANC/assets/data/facilities.json", function(json) {
    district = json[sessionStorage.currentLocation]["District"]; // this will show the info it in firebug console
  });
  
  table = $("#table3").DataTable({"pageLength": 15});
   
  getData(moment(start_date).format("YYYY-MM-DD"));

});

function populateTable(start_date){

  var link = url + '/anc_cohort_disaggregated';

  link += "?date=" + sessionStorage.sessionDate;
  
  link += "&start_date=" + start_date;
  
  link += "&rebuild_outcome=false";
  
  link += '&program_id=' + sessionStorage.programID;

  rebuild_outcome = false;

  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      
      var obj = JSON.parse(this.responseText);
      
      addRows(obj,start_date)
    
    }
  
  };
  
  xhttp.open("GET", link, true);
  
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  
  xhttp.setRequestHeader('Content-type', "application/json");
  
  xhttp.send();
    
}

function addRows(data, current_date){
    
  for(var i = 0; i < indicators.length; i++){

    var indicator = indicators[i];

    for(var j = 0; j < age_category.length; j++){

      var age = age_category[j];
      
      var value = data[moment(current_date).format("MMM YYYY")][indicator][age];

      var span = "<a href='"+decompose_url+encodeURIComponent(JSON.stringify(value))+"'>"+value.length+"</a>"

      table.row.add( [count,district, sessionStorage.currentLocation,
        months[parseInt(moment(current_date).month())], moment(current_date).year(),
        indicators[i], age_category[j], span]).draw();

      count = count + 1;

    }

  }

}

function getData(current_date){
  
  populateTable(current_date)
  
  if(current_date < moment(end_date).add(-1, 'months').format("YYYY-MM-DD")){
    
    setTimeout(function(){
    
      current_date = moment(current_date).add(1, 'months').format("YYYY-MM-DD");
          
      getData(current_date);
    
    }, 1000)
  
  }

}

function monthDiff(d1, d2) {
  
  var months;
  
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  
  months -= d1.getMonth() + 1;
  
  months += d2.getMonth();
  
  return months <= 0 ? 0 : months;

}