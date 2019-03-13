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

var decompose_url = "/apps/ANC/views/reports/decompose.html?ids=";

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

          // Total ANC visits

          total_number_of_anc_visits = results["values"]["total_number_of_anc_visits"]["table"]["contents"];

          document.getElementById("total-anc-visits").innerText = total_number_of_anc_visits.length;

          document.getElementById("a-total-anc-visits").href = decompose_url+encodeURIComponent(JSON.stringify(total_number_of_anc_visits));

          // New visits

          new_visits = results["values"]["new_visits"]["table"]["contents"];

          document.getElementById("new-visits").innerText = new_visits.length;

          document.getElementById("a-new-visits").href = decompose_url+encodeURIComponent(JSON.stringify(new_visits));

          // Subsequent visits

          subsequent_visits = results["values"]["subsequent_visits"]["table"]["contents"];

          document.getElementById("subsequent-visits").innerText = subsequent_visits.length;

          document.getElementById("a-subsequent-visits").href = decompose_url+encodeURIComponent(JSON.stringify(subsequent_visits));

          // First trimester

          first_trimester = results["values"]["first_trimester"]["table"]["contents"];

          document.getElementById("first-trimester").innerText = first_trimester.length;

          document.getElementById("a-first-trimester").href = decompose_url+encodeURIComponent(JSON.stringify(first_trimester));

          // Second trimester

          second_trimester = results["values"]["second_trimester"]["table"]["contents"];

          document.getElementById("second-trimester").innerText = second_trimester.length;

          document.getElementById("a-second-trimester").href = decompose_url+encodeURIComponent(JSON.stringify(second_trimester));

          // Third trimester

          third_trimester = results["values"]["third_trimester"]["table"]["contents"];

          document.getElementById("third-trimester").innerText = third_trimester.length;

          document.getElementById("a-third-trimester").href = decompose_url+encodeURIComponent(JSON.stringify(third_trimester));

          // Teeneger pregnancy

          teeneger_pregnancies = results["values"]["teeneger_pregnancies"]["table"]["contents"];

          document.getElementById("teeneger-pregnancies").innerText = teeneger_pregnancies.length;

          document.getElementById("a-teeneger-pregnancies").href = decompose_url+encodeURIComponent(JSON.stringify(teeneger_pregnancies));

          // Women attending all visits

          women_attending_all_anc_visits = results["values"]["women_attending_all_anc_visits"]["table"]["contents"];

          document.getElementById("women-attending-all-visits").innerText = women_attending_all_anc_visits.length;

          document.getElementById("a-women-attending-all-visits").href = decompose_url+encodeURIComponent(JSON.stringify(women_attending_all_anc_visits));

          // Women screened syphilis

          women_screened_for_syphilis = results["values"]["women_screened_for_syphilis"]["table"]["contents"];

          document.getElementById("women-screened-syphilis").innerText = women_screened_for_syphilis.length;

          document.getElementById("a-women-screened-syphilis").href = decompose_url+encodeURIComponent(JSON.stringify(women_screened_for_syphilis));

          // Women screened HB

          women_checked_hb = results["values"]["women_checked_hb"]["table"]["contents"];

          document.getElementById("women-screened-hb").innerText = women_checked_hb.length;

          document.getElementById("a-women-screened-hb").href = decompose_url+encodeURIComponent(JSON.stringify(women_checked_hb));

          // Women received SP 1 dose

          women_received_sp_one = results["values"]["women_received_sp_one"]["table"]["contents"];

          document.getElementById("women-received-sp1").innerText = women_received_sp_one.length;

          document.getElementById("a-women-received-sp1").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_sp_one));

          // Women received SP 2 doses

          women_received_sp_two = results["values"]["women_received_sp_two"]["table"]["contents"];

          document.getElementById("women-received-sp2").innerText = women_received_sp_two.length;

          document.getElementById("a-women-received-sp2").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_sp_two));

          // Women received SP 3 doses

          women_received_sp_three = results["values"]["women_received_sp_three"]["table"]["contents"];

          document.getElementById("women-received-sp3").innerText = women_received_sp_three.length;

          document.getElementById("a-women-received-sp3").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_sp_three));

          // Women received TTV

          women_received_ttv = results["values"]["women_received_ttv"]["table"]["contents"];

          document.getElementById("women-received-ttv").innerText = women_received_ttv.length;

          document.getElementById("a-women-received-ttv").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_ttv));

          // Women received Iron

          women_received_one_twenty_iron_tabs = results["values"]["women_received_one_twenty_iron_tabs"]["table"]["contents"];

          document.getElementById("women-received-iron").innerText = women_received_one_twenty_iron_tabs.length;

          document.getElementById("a-women-received-iron").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_one_twenty_iron_tabs));

          // Women received albendazole

          women_received_albendazole = results["values"]["women_received_albendazole"]["table"]["contents"];

          document.getElementById("women-received-albendazole").innerText = women_received_albendazole.length;

          document.getElementById("a-women-received-albendazole").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_albendazole));

          // Women received itn

          women_received_itn = results["values"]["women_received_itn"]["table"]["contents"];

          document.getElementById("women-received-itn").innerText = women_received_itn.length;

          document.getElementById("a-women-received-itn").href = decompose_url+encodeURIComponent(JSON.stringify(women_received_itn));

          // Women tested HIV Positive

          women_tested_hiv_positive = results["values"]["women_tested_hiv_positive"]["table"]["contents"];

          document.getElementById("women-tested-hiv-positive").innerText = women_tested_hiv_positive.length;

          document.getElementById("a-women-tested-hiv-positive").href = decompose_url+encodeURIComponent(JSON.stringify(women_tested_hiv_positive));

          // Women previous HIV Positive

          women_prev_hiv_positive = results["values"]["women_prev_hiv_positive"]["table"]["contents"];

          document.getElementById("women-prev-hiv-positive").innerText = women_prev_hiv_positive.length;

          document.getElementById("a-women-prev-hiv-positive").href = decompose_url+encodeURIComponent(JSON.stringify(women_prev_hiv_positive));

          // Women on CPT

          women_on_cpt = results["values"]["women_on_cpt"]["table"]["contents"];

          document.getElementById("women-on-cpt").innerText = women_on_cpt.length;

          document.getElementById("a-women-on-cpt").href = decompose_url+encodeURIComponent(JSON.stringify(women_on_cpt));

          // Women on ART

          women_on_art = results["values"]["women_on_art"]["table"]["contents"]

          document.getElementById("women-on-art").innerText = women_on_art.length;

          document.getElementById("a-women-on-art").href = decompose_url+encodeURIComponent(JSON.stringify(women_on_art));

          // Number of outreach

          total_number_of_outreach_clinic = results["values"]["total_number_of_outreach_clinic"]["table"]["contents"];

          document.getElementById("number-of-outreach").innerText = total_number_of_outreach_clinic.length;

          document.getElementById("a-number-of-outreach").href = decompose_url+encodeURIComponent(JSON.stringify(total_number_of_outreach_clinic));

          // Number of outreach attended

          total_number_of_outreach_clinic_attended = results["values"]["total_number_of_outreach_clinic_attended"]["table"]["contents"];

          document.getElementById("number-of-outreach-attended").innerText = total_number_of_outreach_clinic_attended.length;

          document.getElementById("a-number-of-outreach-attended").href = decompose_url+encodeURIComponent(JSON.stringify(total_number_of_outreach_clinic_attended));

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