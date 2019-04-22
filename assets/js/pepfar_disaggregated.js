var window_href = window.location.href;

window_url = new URL(window_href);

var start_date = window_url.searchParams.get("start_date");

var end_date = window_url.searchParams.get("end_date");

var apiProtocol = sessionStorage.apiProtocol;

var apiPort = sessionStorage.apiPort;

var apiURL = sessionStorage.apiURL;

var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";

var age_category = ["<10", "10-14", "15-19",
    "20-24", "25-29", "30-34", "35-39", "40-49",
    "50+", "Unknown"];

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

function populateTable(){

  var table = document.getElementById("table3");

  var current_date = moment(start_date)

  var count = 1;
  
  for(var i = 1; i <= parseInt(monthdiff + 3); i++){

    for (var j = 0; j < indicators.length; j++){

      for (var k = 0; k < age_category.length; k++){

        var row = table.insertRow(table.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);

        // Add some text to the new cells:
        cell1.innerHTML = count;
        cell2.innerHTML = "Zomba";
        cell3.innerHTML = sessionStorage.currentLocation;
        cell4.innerHTML = months[parseInt(moment(current_date).month())];
        cell5.innerHTML = moment(current_date).year();
        cell6.innerHTML = indicators[j];
        cell7.innerHTML = age_category[k];
        cell8.innerHTML = 0;
         
        count = count + 1;

      }

    }
    current_date.add(1, 'months');
    
  }
}
$(document).ready(function(){
  populateTable();
  $('#table3').DataTable( {
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
   });
});

function getData(age_group){
  var link = url + '/cohort_disaggregated';
  link += "?date=" + sessionStorage.sessionDate;
  link += "&quarter=" + quarter;
  link += "&start_date=" + start_date;
  link += "&end_date=" + end_date;
  link += "&rebuild_outcome=false";
  link += '&program_id=' + sessionStorage.programID;

  rebuild_outcome = false;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);
      console.log(obj);
      //age_groups.shift();
      //loadData(obj, age_group);
    }
  };
  xhttp.open("GET", link, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function initializeGet(){
    getData(age_category[0]);
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

//initializeGet();