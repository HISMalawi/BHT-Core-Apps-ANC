var programID = sessionStorage.programID;

function validateANCBP(){

  try{

    var bp = document.getElementById("vitals-input").value;

    var bp_value = document.getElementById("td-BP").innerHTML;

    if (bp !== "" && bp_value !== "" && bp.match(/\/\d+$/) && programID === "12"){
      
      var bp_diastolic = bp.split("/")[1];
        
      var bp_systolic = bp.split("/")[0];

      if (document.getElementById("error") === null){
  
        inputFrame = document.getElementById("inputFrame"+tstCurrentPage);

        var div = document.createElement("div");
  
        div.className = "error";
  
        div.id = "error";

        div.style.textAlign = "center";

        div.style.fontSize = "26px";

        div.style.color = "red";
  
        var message = "";

        div.innerHTML = message;
      
        inputFrame.after(div);
      
      }else{

        document.getElementById("error").innerHTML = "";

      }

      if (bp_systolic >= 140 && bp_diastolic >= 90) {

        message = "Client is at risk of pre-eclampsia, refer for urine protein test.";

        document.getElementById("error").innerHTML = message;

      }else if (bp_systolic < 120 || bp_systolic > 140) {

        message = "Systolic reading is out of normal range";

        document.getElementById("error").innerHTML = message;

      }else if (bp_diastolic < 80 || bp_diastolic > 90) {

        message = "Diastolic reading is out of normal range";
        
        document.getElementById("error").innerHTML = message;

      }else if ((bp_systolic >= 130 && bp_systolic <= 139) && (bp_diastolic >= 80 && bp_diastolic <= 89)) {

        message = "Prehypertension";
        
        document.getElementById("error").innerHTML = message;

      }


  }else{
    
    document.getElementById("error").innerHTML = ""
  
  }

  }catch(e){

  }

}

$(document).ready(function(){
  
  setInterval(function(){
    
    validateANCBP()

  }, 100);

});