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
  document.getElementById("date").innerText = months_hash[month]+", "+year;

  document.getElementById("site-name").innerText = sessionStorage.currentLocation;

  document.getElementById("r-year").innerText = year;

  document.getElementById("r-month").innerText = months_hash[month];

  document.getElementById("date-filled").innerText = moment(sessionDate).format("DD/MM/YYYY");
  

  function getIndicators(){
    
  var url = apiProtocol + "://" + apiURL + ":" + apiPort 
  url += "/api/v1/programs/"+programID+"/reports/cohort"
  url += "?name=q1&start_date="+date;
    
  var xhttp = new XMLHttpRequest();
    
  xhttp.onreadystatechange = function() {
        
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            
      try{
                
        results = JSON.parse(this.responseText);

        document.getElementById("new-reg").innerText = results["values"]["monthly_patient"]["table"]["contents"].length;

        document.getElementById("preg-test-yes").innerText = results["values"]["pregnancy_test_done"]["table"]["contents"].length;

        document.getElementById("preg-test-done-first-trim").innerText = results["values"]["pregnancy_test_done_in_first_trimester"]["table"]["contents"].length;
        
        document.getElementById("preg-test-not-done-first-trim").innerText = "...";//results["values"]["monthly_patient"]["table"]["contents"].length;

        document.getElementById("week-0-12-of-visit").innerText = results["values"]["week_of_first_visit_zero_to_twelve"]["table"]["contents"].length;

        document.getElementById("week-13-of-visit").innerText = "...";//results["values"]["pregnancy_test_done_in_first_trimester"]["table"]["contents"].length;

        document.getElementById("m-prev-negative").innerText = results["values"]["pre_hiv_negative_first_visit"]["table"]["contents"].length;

        document.getElementById("m-prev-positive").innerText = results["values"]["prev_hiv_positive_first_visit"]["table"]["contents"].length;

        document.getElementById("m-new-positive").innerText = results["values"]["new_hiv_positive_first_visit"]["table"]["contents"].length;

        document.getElementById("m-new-negative").innerText = results["values"]["new_hiv_negative_first_visit"]["table"]["contents"].length;

        document.getElementById("m-hiv-test-not-done").innerText = results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("m-total-hiv-positive").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("m-not-on-art").innerText = results["values"]["not_on_art_first_visit"]["table"]["contents"].length;

        document.getElementById("m-on-art-before-visit").innerText = results["values"]["on_art_before_anc_first_visit"]["table"]["contents"].length;

        document.getElementById("m-art-0-27-weeks").innerText = results["values"]["start_art_zero_to_twenty_seven_for_first_visit"]["table"]["contents"].length;

        document.getElementById("m-art-28-weeks").innerText = results["values"]["start_art_plus_twenty_eight_for_first_visit"]["table"]["contents"].length;
        
        document.getElementById("total-1-visit").innerText = results["values"]["patients_with_total_of_one_visit"]["table"]["contents"].length;
        
        document.getElementById("total-2-visits").innerText = results["values"]["patients_with_total_of_two_visits"]["table"]["contents"].length;
       
        document.getElementById("total-3-visits").innerText = results["values"]["patients_with_total_of_three_visits"]["table"]["contents"].length;
        
        document.getElementById("total-4-visits").innerText = results["values"]["patients_with_total_of_four_visits"]["table"]["contents"].length;
        
        document.getElementById("total-5-visits").innerText = results["values"]["patients_with_total_of_five_plus_visits"]["table"]["contents"].length;
        
        document.getElementById("total-women-in-cohort").innerText = results["values"]["total_women_in_cohort"]["table"]["contents"].length;
        
        document.getElementById("patients-with-pre-eclampsia").innerText = results["values"]["patients_with_pre_eclampsia"]["table"]["contents"].length;

        document.getElementById("patients-without-pre-eclampsia").innerText = results["values"]["patients_without_pre_eclampsia"]["table"]["contents"].length;

        document.getElementById("patients-given-less-than-2-ttv-doses").innerText = results["values"]["patients_given_ttv_less_than_two_doses"]["table"]["contents"].length;

        document.getElementById("patients-given-more-than-1-ttv-doses").innerText = results["values"]["patients_given_ttv_at_least_two_doses"]["table"]["contents"].length;

        document.getElementById("patients-given-0-2-sp-doses").innerText = results["values"]["patients_given_zero_to_two_sp_doses"]["table"]["contents"].length;

        document.getElementById("patients-given-3-sp-doses").innerText = results["values"]["patients_given_at_least_three_sp_doses"]["table"]["contents"].length;

        document.getElementById("patients-given-less-than-120-fefol-tabs").innerText = results["values"]["patients_given_less_than_one_twenty_fefol_tablets"]["table"]["contents"].length;

        document.getElementById("patients-given-at-least-120-fefol-tabs").innerText = results["values"]["patients_given_one_twenty_plus_fefol_tablets"]["table"]["contents"].length;

        document.getElementById("patients-not-given-albendazole").innerText = results["values"]["patients_not_given_albendazole_doses"]["table"]["contents"].length;
        
        document.getElementById("patients-given-one-albendazole-dose").innerText = results["values"]["patients_given_one_albendazole_dose"]["table"]["contents"].length;
        
        document.getElementById("patients-not-given-bed-net").innerText = results["values"]["patients_not_given_bed_net"]["table"]["contents"].length;
        
        document.getElementById("patients-given-bed-net").innerText = results["values"]["patients_given_bed_net"]["table"]["contents"].length;
        
        document.getElementById("patients-with-hb-less-than-7").innerText = results["values"]["patients_have_hb_less_than_7_g_dl"]["table"]["contents"].length;

        document.getElementById("patients-with-hb-at-least-7").innerText = results["values"]["patients_have_hb_greater_than_6_g_dl"]["table"]["contents"].length;

        document.getElementById("patients-with-hb-not-done").innerText = results["values"]["patients_hb_test_not_done"]["table"]["contents"].length;

        document.getElementById("patients-with-syphilis-negative").innerText = results["values"]["patients_with_negative_syphilis_status"]["table"]["contents"].length;

        document.getElementById("patients-with-syphilis-positive").innerText = results["values"]["patients_with_positive_syphilis_status"]["table"]["contents"].length;

        document.getElementById("patients-with-syphilis-unknown").innerText = results["values"]["patients_with_unknown_syphilis_status"]["table"]["contents"].length;

        document.getElementById("c-prev-negative").innerText = results["values"]["pre_hiv_negative_final_visit"]["table"]["contents"].length;

        document.getElementById("c-prev-positive").innerText = results["values"]["prev_hiv_positive_final_visit"]["table"]["contents"].length;

        document.getElementById("c-new-positive").innerText = results["values"]["new_hiv_positive_final_visit"]["table"]["contents"].length;

        document.getElementById("c-new-negative").innerText = results["values"]["new_hiv_negative_final_visit"]["table"]["contents"].length;

        document.getElementById("c-hiv-test-not-done").innerText = results["values"]["not_done_hiv_test_final_visit"]["table"]["contents"].length;

        document.getElementById("c-total-hiv-positive").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;
        
        document.getElementById("not-on-cpt").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("on-cpt").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("nvp-not-given").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("nvp-given").innerText = "...";//results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"].length;

        document.getElementById("c-not-on-art").innerText = results["values"]["not_on_art_final_visit"]["table"]["contents"].length;

        document.getElementById("c-on-art-before-visit").innerText = results["values"]["on_art_before_anc_final_visit"]["table"]["contents"].length;

        document.getElementById("c-art-0-27-weeks").innerText = results["values"]["start_art_zero_to_twenty_seven_for_final_visit"]["table"]["contents"].length;

        document.getElementById("c-art-28-weeks").innerText = results["values"]["start_art_plus_twenty_eight_for_final_visit"]["table"]["contents"].length;


        console.log(results["values"]["monthly_patient"]["table"]["contents"]);
  
      } catch(e){

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