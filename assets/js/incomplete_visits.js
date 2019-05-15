var window_href = window.location.href;

window_url = new URL(window_href);

var start_date = window_url.searchParams.get("start_date");

var end_date = window_url.searchParams.get("end_date");

var facility_name = sessionStorage.currentLocation;

var apiProtocol = sessionStorage.apiProtocol;

var apiPort = sessionStorage.apiPort;

var apiURL = sessionStorage.apiURL;

var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";

var decompose_url = "/views/patient_dashboard.html?patient_id=";

var table = null;

$(document).ready(function(){
  
  $("#site_name").html(facility_name);

  $("#start_date").html(start_date);

  $("#end_date").html(end_date);

  table = $("#table3").DataTable({"pageLength": 15,
            dom: 'Bfrtip',
            buttons: [
              { extend: 'excel', text: 'Export excel', className: 'blue'}
            ]
          });
  table.buttons().container().prependTo('#print');

  getData();

});

function getData(){

    var link = url + '/incomplete_visits';

    link += "?date=" + sessionStorage.sessionDate;
    
    link += "&start_date=" + start_date;
    
    link += "&end_date=" + end_date;
    
    link += '&program_id=' + sessionStorage.programID;
  
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
      
      if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
        
        var obj = JSON.parse(this.responseText);
        
        addRows(obj)
      
      }
    
    };
    
    xhttp.open("GET", link, true);
    
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    
    xhttp.setRequestHeader('Content-type', "application/json");
    
    xhttp.send()

}

function addRows(data){
  var count = 1;
  for(key in data){

    patient_id = data[key].patient_id

    var span = "<a href='"+decompose_url+patient_id+"'>VIEW</a>"
    
    table.row.add( [count,data[key].name, data[key].n_id, data[key].visit_no,
        data[key].visit_date, span]).draw();
    
    count = count + 1;

  }

}