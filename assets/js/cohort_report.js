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

          // New registered

          var new_registered = results["values"]["monthly_patient"]["table"]["contents"];

          document.getElementById("new-reg").innerText = new_registered.length;

          document.getElementById("a-new-reg").href = decompose_url+encodeURIComponent(JSON.stringify(new_registered));

          // Pregnancy test done

          var preg_test_done = results["values"]["pregnancy_test_done"]["table"]["contents"];

          document.getElementById("preg-test-yes").innerText = preg_test_done.length;

          document.getElementById("a-preg-test-yes").href = decompose_url+encodeURIComponent(JSON.stringify(preg_test_done));

          // Pregnancy test not done

          var preg_test_not_done = results["values"]["pregnancy_test_not_done"]["table"]["contents"];

          document.getElementById("preg-test-no").innerText = preg_test_not_done.length;

          document.getElementById("a-preg-test-no").href = decompose_url+encodeURIComponent(JSON.stringify(preg_test_not_done));

          // Pregnancy test done in first trimester

          var preg_test_done_in_first_trim = results["values"]["pregnancy_test_done_in_first_trimester"]["table"]["contents"];

          document.getElementById("preg-test-done-first-trim").innerText = preg_test_done_in_first_trim.length;

          document.getElementById("a-preg-test-done-first-trim").href = decompose_url+encodeURIComponent(JSON.stringify(preg_test_done_in_first_trim));

          // Pregnancy test not done in first trimester

          var preg_test_not_done_in_first_trim = results["values"]["pregnancy_test_not_done_in_first_trimester"]["table"]["contents"];

          document.getElementById("preg-test-not-done-first-trim").innerText = preg_test_not_done_in_first_trim.length;
          
          document.getElementById("a-preg-test-not-done-first-trim").href = decompose_url+encodeURIComponent(JSON.stringify(preg_test_not_done_in_first_trim));

          // Week of first visits (0-12 weeks)

          var week_0_12_of_visit = results["values"]["week_of_first_visit_zero_to_twelve"]["table"]["contents"];

          document.getElementById("week-0-12-of-visit").innerText = week_0_12_of_visit.length;

          document.getElementById("a-week-0-12-of-visit").href = decompose_url+encodeURIComponent(JSON.stringify(week_0_12_of_visit));

          // Week of first visits (13+ weeks)

          var week_plus_13_of_visit = results["values"]["week_of_first_visit_plus_thirteen"]["table"]["contents"];

          document.getElementById("week-13-of-visit").innerText = week_plus_13_of_visit.length;

          document.getElementById("a-week-13-of-visit").href = decompose_url+encodeURIComponent(JSON.stringify(week_plus_13_of_visit));

          // Previous HIV negative on first visit

          var prev_hiv_neg_first = results["values"]["pre_hiv_negative_first_visit"]["table"]["contents"];

          document.getElementById("m-prev-negative").innerText = prev_hiv_neg_first.length;

          document.getElementById("a-m-prev-negative").href = decompose_url+encodeURIComponent(JSON.stringify(prev_hiv_neg_first));

          // Previous HIV positive on first visit

          var prev_hiv_pos_first = results["values"]["prev_hiv_positive_first_visit"]["table"]["contents"];

          document.getElementById("m-prev-positive").innerText = prev_hiv_pos_first.length;
          
          document.getElementById("a-m-prev-positive").href = decompose_url+encodeURIComponent(JSON.stringify(prev_hiv_pos_first));

          // New positive first visit

          var new_hiv_neg_first = results["values"]["new_hiv_negative_first_visit"]["table"]["contents"];

          document.getElementById("m-new-negative").innerText = new_hiv_neg_first.length;

          document.getElementById("a-m-new-negative").href = decompose_url+encodeURIComponent(JSON.stringify(new_hiv_neg_first));

          // New negative on first visit

          var new_hiv_pos_first = results["values"]["new_hiv_positive_first_visit"]["table"]["contents"];

          document.getElementById("m-new-positive").innerText = new_hiv_pos_first.length;

          document.getElementById("a-m-new-positive").href = decompose_url+encodeURIComponent(JSON.stringify(new_hiv_pos_first));

          // HIV Test not done on first visit

          var hiv_test_not_done_first = results["values"]["not_done_hiv_test_first_visit"]["table"]["contents"];

          document.getElementById("m-hiv-test-not-done").innerText = hiv_test_not_done_first.length;

          document.getElementById("a-m-hiv-test-not-done").href = decompose_url+encodeURIComponent(JSON.stringify(hiv_test_not_done_first));

          // Total HIV positive on first visits

          var total_hiv_pos_first = results["values"]["total_hiv_positive_first_visit"]["table"]["contents"];

          document.getElementById("m-total-hiv-positive").innerText = total_hiv_pos_first.length;

          document.getElementById("a-m-total-hiv-positive").href = decompose_url+encodeURIComponent(JSON.stringify(total_hiv_pos_first));
          
          // HIV patients Not on ART first visit

          not_on_art_first = results["values"]["not_on_art_first_visit"]["table"]["contents"];

          document.getElementById("m-not-on-art").innerText = not_on_art_first.length;

          document.getElementById("a-m-not-on-art").href = decompose_url+encodeURIComponent(JSON.stringify(not_on_art_first));
          
          // HIV patients on art before ANC visit 

          on_art_before_first_visit = results["values"]["on_art_before_anc_first_visit"]["table"]["contents"];

          document.getElementById("m-on-art-before-visit").innerText = on_art_before_first_visit.length;

          document.getElementById("a-m-on-art-before-visit").href = decompose_url+encodeURIComponent(JSON.stringify(on_art_before_first_visit));

          // HIV patients started art between 0 to 27 weeks
          
          art_0_27_first_weeks = results["values"]["start_art_zero_to_twenty_seven_for_first_visit"]["table"]["contents"];

          document.getElementById("m-art-0-27-weeks").innerText = art_0_27_first_weeks.length;
          
          document.getElementById("a-m-art-0-27-weeks").href = decompose_url+encodeURIComponent(JSON.stringify(art_0_27_first_weeks));

          // HIV patients started art after 27 weeks

          art_over_27_first_weeks = results["values"]["start_art_plus_twenty_eight_for_first_visit"]["table"]["contents"];

          document.getElementById("m-art-28-weeks").innerText = art_over_27_first_weeks.length;
          
          document.getElementById("a-m-art-28-weeks").href = decompose_url+encodeURIComponent(JSON.stringify(art_over_27_first_weeks));


          
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