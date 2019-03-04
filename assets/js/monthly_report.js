var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var programID = sessionStorage.programID;

var sessionDate = sessionStorage.sessionDate;

var months_hash = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
}

var params = getUrlParams();

var year = params["year"];

var month = params["months"];

var date = year+"-"+month+"-01";

$(document).ready(function(){

  // Populate report header

  document.getElementById("site-name").innerText = sessionStorage.currentLocation;

  document.getElementById("r-year").innerText = year;

  document.getElementById("r-month").innerText = months_hash[month];

  document.getElementById("date-filled").innerText = moment(sessionDate).format("DD/MM/YYYY");

  function getIndicators(){
    
    var url = apiProtocol + "://" + apiURL + ":" + apiPort 
    url += "/api/v1/programs/"+programID+"/reports/monthly"
    url += "?name=q1&start_date="+date;
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        
      if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            
        try{

          results = JSON.parse(this.responseText);

          document.getElementById("total-anc-visits").innerText = results["values"]["total_number_of_anc_visits"]["table"]["contents"].length;

          document.getElementById("new-visits").innerText = results["values"]["new_visits"]["table"]["contents"].length;

          document.getElementById("subsequent-visits").innerText = results["values"]["subsequent_visits"]["table"]["contents"].length;

          document.getElementById("first-trimester").innerText = results["values"]["first_trimester"]["table"]["contents"].length;

          document.getElementById("second-trimester").innerText = results["values"]["second_trimester"]["table"]["contents"].length;

          document.getElementById("third-trimester").innerText = results["values"]["third_trimester"]["table"]["contents"].length;

          document.getElementById("teeneger-pregnancies").innerText = results["values"]["teeneger_pregnancies"]["table"]["contents"].length;

          document.getElementById("women-attending-all-visits").innerText = results["values"]["women_attending_all_anc_visits"]["table"]["contents"].length;

          document.getElementById("women-screened-syphilis").innerText = results["values"]["women_screened_for_syphilis"]["table"]["contents"].length;

          document.getElementById("women-screened-hb").innerText = results["values"]["women_checked_hb"]["table"]["contents"].length;

          document.getElementById("women-received-sp1").innerText = results["values"]["women_received_sp_one"]["table"]["contents"].length;

          document.getElementById("women-received-sp2").innerText = results["values"]["women_received_sp_two"]["table"]["contents"].length;

          document.getElementById("women-received-sp3").innerText = results["values"]["women_received_sp_three"]["table"]["contents"].length;

          document.getElementById("women-received-ttv").innerText = results["values"]["women_received_ttv"]["table"]["contents"].length;

          document.getElementById("women-received-iron").innerText = results["values"]["women_received_one_twenty_iron_tabs"]["table"]["contents"].length;

          document.getElementById("women-received-albendazole").innerText = results["values"]["women_received_albendazole"]["table"]["contents"].length;

          document.getElementById("women-received-itn").innerText = results["values"]["women_received_itn"]["table"]["contents"].length;

          document.getElementById("women-tested-hiv-positive").innerText = results["values"]["women_tested_hiv_positive"]["table"]["contents"].length;

          document.getElementById("women-prev-hiv-positive").innerText = results["values"]["women_prev_hiv_positive"]["table"]["contents"].length;

          document.getElementById("women-on-cpt").innerText = results["values"]["women_on_cpt"]["table"]["contents"].length;

          document.getElementById("women-on-art").innerText = results["values"]["women_on_art"]["table"]["contents"].length;

          document.getElementById("number-of-outreach").innerText = results["values"]["total_number_of_outreach_clinic"]["table"]["contents"].length;

          document.getElementById("number-of-outreach-attended").innerText = results["values"]["total_number_of_outreach_clinic_attended"]["table"]["contents"].length;
          console.log()

        }catch(e){

          console.log(e);

        }
        
      }
    
    };
  
    xhttp.open("GET", url, true);
    
    xhttp.setRequestHeader('Authorization', sessionStorage.authorization);
    
    xhttp.setRequestHeader('Content-type', "application/json");
    
    xhttp.send();

  }

  getIndicators();

});