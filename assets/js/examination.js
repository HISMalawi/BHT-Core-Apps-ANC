var fundus_by_lmp = "<%= @anc_patient.fundus_by_lmp %>"
var check = 0;
var breech = 0;
var selectedSigns = "";
var values_hash = {};

function selectNone(){
    
  if (__$("chkSelectAll") && __$("lblSelectAll")){

    __$("lblSelectAll").innerHTML = "None";

    __$("chkSelectAll").onclick = function(){
      if ( __$("chkSelectAll").src.match(/unticked/))
        __$("chkSelectAll").src = __$("chkSelectAll").src.replace(/unticked/, "ticked");
      checkAll();
      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true")
      setTimeout("gotoNextPage()", 200);
    }
    __$("lblSelectAll").onclick = function(){

      if ( __$("chkSelectAll").src.match(/unticked/))
        __$("chkSelectAll").src = __$("chkSelectAll").src.replace(/unticked/, "ticked");
      checkAll();
      __$("touchscreenInput" + tstCurrentPage).setAttribute("optional", "true");

      setTimeout("gotoNextPage()", 200);
    }
  }
  setTimeout("selectNone()", 50);
}

function changeUnknownToNone() {
  if (__$("Unknown")) {
    __$("Unknown").innerHTML = "<span>None</span>";
    __$("Unknown").onmousedown = function () {
      __$("touchscreenInput" + tstCurrentPage).value = "None";
    }
  }
}

function readableMessage() {

  var conceptName = conceptHash[tstCurrentPage]
  try {
      conceptName = conceptName.charAt(0).toUpperCase() + conceptName.slice(1).toLowerCase();
      if (__$("messageBar") && !__$("messageBar").innerHTML.match(conceptName)) {
        __$("messageBar").innerHTML = __$("messageBar").innerHTML.replace("Value", conceptName + " Value").replace("value", conceptName + " value").replace("a " + conceptName + " value", conceptName + " value")
      }
  } catch (ex) {

  }
  
  setTimeout(function () {
    readableMessage()
  }, 50);
}

function buildConceptsHash() {
  var count = 0;
  var inputArr = document.getElementsByTagName("input")
  conceptHash = {};
  for (var i = 0; i < inputArr.length; i++) {
    if (inputArr[i].name && inputArr[i].name.match("concept_name") && inputArr[i].name.match("observations")) {
      conceptHash[count] = inputArr[i].value;
      count++;
    }
  }
}

function set_ajaxURL_for_suggestions(url, filter_value) {
  $('touchscreenInput' + tstCurrentPage).setAttribute('ajaxURL', url + filter_value + "&search_string=");
  listSuggestions(tstCurrentPage);
}

function ajaxify(cat, selected) {
  
  if (selected == "Ball" || selected == "Nill palpable") {
    __$("frame2").style.display = "none";
    __$("htext2").style.display = "none";
    jQuery
  } else if (selected.length > 0) {
    try {
      __$("frame2").style.display = "block";
      __$("htext2").style.display = "block";
    }catch(e){

    }
  }
  
  if (cat == "presentation") {
    if ((selected.toLowerCase() == 'breech') && 
      ( __$('presentation').value.toLowerCase() == 'breech')) {
      data = ["", "Right Sacro Anterior", "Left Sacro Anterior", "Unknown"].join('|')
      handleResultData(cat, data, "breech_presentation");
    }else if (selected.toLowerCase() == 'cephalic') {
      data = ["", "Right Occipito Anterior", "Left Occipito Anterior", "Unknown"].join('|')
      handleResultData(cat, data, "cephalic_presentation");
    }else if (selected.toLowerCase() == 'ball' || selected.toLowerCase() == 'nill palpable') {
      data = "";
      handleResultData(cat, data, "");
    }

  } else if (cat == "district") {
    data = ""
    handleResultData(cat, data);
  }

}

function updateCustomTouchscreenInput(element) {
  values_hash["district"] = element.innerHTML;
  var inputTarget = tstInputTarget;

  if (element.value.length > 1)
    inputTarget.value = element.value;
  else if (element.innerHTML.length > 1)
    inputTarget.value = element.innerHTML;

  highlightSelection(element.parentNode.childNodes, inputTarget);
  tt_update(inputTarget);
}

function verifyFields() {

  if (__$("viewport3")) {
    var handlers = ["viewport", "viewport2", "viewport3", "viewport4"];
    var messages = {"viewport": "Select presentation to proceed",
    "viewport2": "Select presentation type to proceed",
    "viewport3": "Select position to proceed",
    "viewport4": "Select position type to proceed"
   }
   
   var targets = {"viewport": "presentation",
      "viewport2": "",
      "viewport3": "position",
      "viewport4": ""
    }
    
    //******* clear deselected fields
    var selectedNodes = jQuery("#viewport3 ul li, #viewport4 ul li").filter(function () {
      return this.style.backgroundColor == 'lightblue';
    });
    console.log(selectedNodes)
    console.log(selectedNodes)
    console.log(selectedNodes)
    
    if (selectedNodes.length > 0 && jQuery(selectedNodes[0]).visible() == false) {
      __$("position").value = "";
      if(__$("presentation").value.toLowerCase().trim() == "ball" || 
        __$("presentation").value.toLowerCase().trim() == "nill palpable"){

        __$("breech_presentation").value = "";
        __$("cephalic_presentation").value = "";
      }
                if (jQuery(selectedNodes[0]).attr("target") != "") {

                    for (var i in selectedNodes) {
                        try {
                            __$(jQuery(selectedNodes[i]).attr("target")).value = "";
                        } catch (e) {
                        }
                    }
                }
                jQuery("#viewport3 ul li, #viewport2 ul li, #viewport4 ul li").css("background-color", "#eee");
            }
            //********* done clearing fields

            var proceed = true;
            for (var k = 0; k < handlers.length; k++) {

                var target = targets[handlers[k]]
                var nodes = __$(handlers[k]).getElementsByTagName("li")

                if (__$(handlers[k]).innerHTML != "" && nodes.length > 1 && __$(handlers[k]).parentNode.style.display != "none") {

                    var highlighted = false;
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i] && nodes[i].innerHTML.length > 1 && (nodes[i].style.background == "lightblue" || nodes[i].style.backgroundColor == "lightblue")) {

                            highlighted = true;
                            if (target == "")
                                target = nodes[i].getAttribute("target");

                            if (__$(target)) {
                                __$(target).value = nodes[i].innerHTML;
                            }
                        }
                    }

                    if (!highlighted) {

                        showMessage(messages[handlers[k]], false, false);
                        proceed = false;
                        break;
                    }
                }
            }

            if (proceed) {
                 gotoPage(tstCurrentPage + 1)
            }
        } //else {
          //gotoNextPage();
        //}
    }

    function handleResultData(cat, result, target) {
        values_hash["region"] = tstInputTarget.value;
        values_hash["district"] = '';

        if (cat == "presentation") {
            __$("sc2").innerHTML = ""
            var data = result.split("|");
            var ul = document.createElement("ul");
            for (var i = 0; i < data.length; i++) {
                var li = document.createElement("li")
                li.setAttribute("class", "district");
                li.setAttribute("target", target);
                li.value = data[i]
                li.innerHTML = data[i]
                li.onmousedown = function () {
                    updateCustomTouchscreenInput(this);
                }
                ul.appendChild(li);
            }
            __$("sc2").appendChild(ul);
        } else if (cat == "district") {

            var data = result.split("|");

            var ul = document.createElement("ul");

            for (var i = 0; i < data.length; i++) {

                var li = document.createElement("li")
                li.setAttribute("class", "ta");
                li.value = data[i];
                li.innerHTML = data[i];
                li.onmousedown = function () {

                    updateCustomTouchscreenInput(this);
                }

                ul.appendChild(li);
            }

        }

    }


    function updateInputFields() {
        if (value != tstInputTarget.value) {
            value = tstInputTarget.value;
            if (value.length > 0) {

                ajaxify("presentation", value);
            }
        }


        if (region_terminal == false) {
            setTimeout("updateInputFields()", 100);
        }
    }
    function clearAll() {
        __$('presentation').value = "";
        __$('breech').value = "";
        __$('cephalic').value = "";
        __$('position').value = "";
    }
    function ajaxifyInput() {
        value = tstInputTarget.value
        region_terminal = false;

        //clear previous selections
        __$("clearButton").onmousedown.apply(__$("clearButton"));
        setTimeout("updateInputFields()", 100)
        __$("touchscreenInput" + tstCurrentPage).style.display = "none";
        __$("inputFrame" + tstCurrentPage).style.maxHeight = (screen.height / 3.1) + "px";

        __$("viewport").style.width = 0.47 * screen.width + "px";
        __$("viewport").style.borderStyle = "solid";

        __$("viewport").style.maxHeight = __$("inputFrame" + tstCurrentPage).style.maxHeight;
        __$("viewport").style.borderWidth = "1px";
        __$("viewport").style.borderTop = "hidden";
        __$("viewport").style.borderLeft = "hidden";
        __$("viewport").style.borderBottom = "hidden";

        var view2 = document.createElement("div");
        view2.id = "viewport2"
        view2.setAttribute("class", "options");
        view2.style.position = "absolute";
        view2.style.top = "9%";
        view2.style.left = 0.5 * screen.width + "px";
        view2.style.width = 0.46 * screen.width + "px";
        view2.style.maxHeight = __$("inputFrame" + tstCurrentPage).style.maxHeight;
        view2.style.borderStyle = "solid";
        view2.style.borderWidth = "1px";
        view2.style.borderTop = "hidden";
        view2.style.borderLeft = "hidden";
        view2.style.borderBottom = "hidden";
        view2.style.borderRight = "hidden";

        var sc2 = document.createElement("div");
        sc2.setAttribute("class", "scrollable");
        sc2.setAttribute("referstotouchscreeninputid", tstCurrentPage + 1);
        sc2.id = "sc2";
        view2.appendChild(sc2);
        __$("inputFrame" + tstCurrentPage).appendChild(view2);
        __$("inputFrame" + tstCurrentPage).style.marginBottom = "8px";

        var htext2 = document.createElement("label");
        htext2.innerHTML = "Position";
        htext2.id = "htext2";
        htext2.style.display = "none";
        htext2.setAttribute("class", "helpTextClass");
        __$("page" + tstCurrentPage).appendChild(htext2);

        var frame2 = document.createElement("div");
        frame2.id = "frame2";
        frame2.style.display = "none";
        frame2.setAttribute("class", "inputFrameClass");
        frame2.style.height = (screen.height / 2.7) + "px";
        frame2.style.maxHeight = (screen.height / 2.7) + "px";

        __$("page" + tstCurrentPage).appendChild(frame2);
        var view3 = document.createElement("div");
        view3.id = "viewport3";
        view3.setAttribute("class", "options");
        view3.style.position = "absolute";
        view3.style.top = ((screen.height / 6.5) + (screen.height / 3.4) + 20) + "px";
        view3.style.left = "26px";
        view3.style.width = 0.465 * screen.width + "px";
        view3.style.marginLeft = 0.005 * screen.width + "px";
        view3.style.maxHeight = (screen.height / 2.6) + "px";
        view3.style.borderStyle = "solid";
        view3.style.borderWidth = "1px";
        view3.style.borderTop = "hidden";
        view3.style.borderLeft = "hidden";
        view3.style.borderBottom = "hidden";
        view3.style.borderLeft = "hidden";
        frame2.appendChild(view3);

        var sc3 = document.createElement("div");
        sc3.setAttribute("class", "scrollable");
        sc3.setAttribute("referstotouchscreeninputid", tstCurrentPage + 1);
        sc3.id = "sc3";
        view3.appendChild(sc3);

        var values = ["", "Vertex", "Oblique", "Transverse", "Breech", "Face", "Shoulder"]
        var ul = document.createElement("ul");

        for (var i = 0; i < values.length; i++) {

            var li = document.createElement("li")
            li.setAttribute("class", "ta");
            li.value = values[i];
            li.setAttribute("data", values[i]);
            li.innerHTML = values[i];

            li.onmousedown = function () {

                __$("position").value = this.getAttribute("data");
                console.log(this.getAttribute('data'));

                var targetCheckers = jQuery("#sc4 ul li").filter(function () {
                    return this.style.backgroundColor == 'lightblue';
                });
                console.log(targetCheckers);

                if (targetCheckers && targetCheckers.length == 1) {
                    var target  = targetCheckers[0].getAttribute("target")
                        if (target && target.length > 0){
                            __$(target).value = "";
                            console.log("Cleaned: " + target)
                        }
                }

                __$("sc4").innerHTML = "";
                var arr = [""];
                var target = "";
                target = __$("position").value.trim().toLowerCase();
                console.log(target);

                switch (this.getAttribute('data').trim().toLowerCase()) {

                    case "vertex":
                        arr = ["", "Left Occipito Anterior",
                            "Left Occipito Transverse",
                            "Left Occipito Posterior",
                            "Right Occipito Anterior",
                            "Right Occipito Transverse",
                            "Right Occipito Posterior",
                            "Unknown"];
                        break;

                    case "breech":
                        arr = ["", "Left Sacro Anterior",
                            "Left Sacro Transverse",
                            "Left Sacro Posterior",
                            "Right Sacro Anterior",
                            "Right Sacro Transverse",
                            "Right Sacro Posterior",
                            "Unknown"];
                        break;

                    case "face":
                        arr = ["", "Left Mento Anterior",
                            "Left Mento Transverse",
                            "Left Mento Posterior",
                            "Right Mento Anterior",
                            "Right Mento Transverse",
                            "Right Mento Posterior",
                            "Unknown"];
                        break;

                    case "shoulder":
                        arr = ["", "Left Acromion Dorsal Anterior",
                            "Left Acromion Dorsal Posterior",
                            "Right Acromion Dorsal Anterior",
                            "Right Acromion Dorsal Posterior",
                            "Unknown"];
                        break;

                    default:
                        arr = [""];
                }

                var ul = document.createElement("ul");

                for (var j = 0; j < arr.length; j++) {

                    var li = document.createElement("li")
                    li.setAttribute("class", "ta");
                    li.value = arr[j];
                    li.innerHTML = arr[j];
                    li.setAttribute("target", target);
                    li.setAttribute("data", arr[j]);

                    li.onmousedown = function () {

                        updateCustomTouchscreenInput(this);
                    }
                    ul.appendChild(li);
                }

                __$("sc4").appendChild(ul);
                updateCustomTouchscreenInput(this);
            }

            ul.appendChild(li);
        }

        sc3.appendChild(ul);

        var view4 = document.createElement("div");
        view4.id = "viewport4";
        view4.setAttribute("class", "options");
        view4.style.position = "absolute";
        view4.style.top = ((screen.height / 6.5) + (screen.height / 3.4) + 20) + "px";
        view4.style.left = 0.5 * screen.width + "px";
        view4.style.width = 0.46 * screen.width + "px";
        view4.style.maxHeight = (screen.height / 2.5) + "px";
        view4.style.borderStyle = "solid";
        view4.style.borderWidth = "1px";
        view4.style.borderTop = "hidden";
        view4.style.borderLeft = "hidden";
        view4.style.borderBottom = "hidden";
        view4.style.borderRight = "hidden";
        frame2.appendChild(view4);

        var sc4 = document.createElement("div");
        sc4.setAttribute("class", "scrollable");
        sc4.setAttribute("referstotouchscreeninputid", tstCurrentPage + 1);
        sc4.id = "sc4";
        view4.appendChild(sc4);
    }
    function addAbsoluteMax(id){
        abMax = __$(id).value;
        jQuery('#touchscreenInput'+ tstCurrentPage).attr("absoluteMax", fundus_by_lmp);
    }

    function validateFundalHeight(){
      var fundal_input = __$('touchscreenInput'+tstCurrentPage);
      var max_value = 0
      
      if (fundus_by_lmp <= 13){
        max_value = 12;
      }else if (fundus_by_lmp <= 14){
        max_value = 13
      }else if (fundus_by_lmp <= 16){
        max_value = 14
      }else if (fundus_by_lmp <= 17){
        max_value = 15
      }else if (fundus_by_lmp <= 18){
        max_value = 16
      }else if (fundus_by_lmp <= 19){
        max_value = 17
      }else if (fundus_by_lmp <= 20){
        max_value = 18
      }else if (fundus_by_lmp <= 19){
        max_value = 21
      }else if (fundus_by_lmp <= 22){
        max_value = 20
      }else if (fundus_by_lmp <= 24){
        max_value = 21
      }else if (fundus_by_lmp <= 25){
        max_value = 22
      }else if (fundus_by_lmp <= 26){
        max_value = 23
      }else if (fundus_by_lmp <= 27){
        max_value = 24
      }else if (fundus_by_lmp <= 28){
        max_value = 25
      }else if (fundus_by_lmp <= 29){
        max_value = 26
      }else if (fundus_by_lmp <= 30){
        max_value = 27
      }else if (fundus_by_lmp <= 32){
        max_value = 28
      }else if (fundus_by_lmp <= 33){
        max_value = 29
      }else if (fundus_by_lmp <= 34){
        max_value = 30
      }else if (fundus_by_lmp <= 35){
        max_value = 31
      }else if (fundus_by_lmp <= 36){
        max_value = 32
      }else if (fundus_by_lmp <= 37){
        max_value = 33
      }else if (fundus_by_lmp <= 38){
        max_value = 34
      }else if (fundus_by_lmp <= 39){
        max_value = 35
      }else if (fundus_by_lmp <= 40){
        max_value = 36
      }else if (fundus_by_lmp <= 42){
        max_value = 37
      }else if (fundus_by_lmp > 42){
        max_value = 38
      }

      fundal_input.setAttribute("absoluteMax", max_value)
    }

    

    setTimeout("selectNone()", 50);
    //setInterval("validateFundalHeight()", 200);
    //-->