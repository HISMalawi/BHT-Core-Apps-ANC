var GlobalPageData = {
  // Track data here
  pregDetailsPage: {
    activeFields: [],
    components: {},
    methods: {}
  }
}

var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var patientDOB = sessionStorage.patientDOB;

var patientAge = sessionStorage.patientAge;

var programID = sessionStorage.programID;

var sessionDate = sessionStorage.sessionDate;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var $$ = {};
      
var data = {};
      
var counts = {};
      
var deliveries = 0;
      
var max_delivered = 1;
      
var parity;
      
var parsedConceptName;
      
var x = [];
      
var observations = [];

var prev_complications = {};

concepts_hash = {
    'Yes': 1065,
    'No': 1066,
    'pre_eclampsia': 7941,
    'hemorrhage': 7977,
    'eclampsia': 7156,
    'ever_had_episiotomy' : 8758,
    'PPH' : 230,
    'APH' : 228,
    'Complete abortion' : 7372,
    'Incomplete abortion' : 905
  }
  
var last_visit = "";

var birth_date = new Date(patientDOB);

var current_date =  new Date(sessionDate);

var this_year = current_date.getFullYear();
      
var birth_year = birth_date.getFullYear();

var mother_age = parseInt(patientAge) - 10;

// Minimum birth year of a child = mother birth year plus 13 more years.

var min_birth_year = (parseInt(birth_year) + 13).toString(); 

// Max birth year of a child = previous year.
      
var max_birth_year = birth_year;

// Absolute max for birth of a child = this year.
      
var abs_max_birth_year = this_year;
      
var current_popup = "Enter Value";

var $$ = {};
      
var data = {};
      
var counts = {};

var gravida_value = "";

var defaultNextAction = ''
var lastGravida = 0

/**
 * Helper module to hack touchscreentoolkit
 */
var InputFrame = (function() {
  function append(htmlElement) {
    $("keyboard").style.display = "none";
        
    $("touchscreenInput" + tstCurrentPage).style.display = "none";
          
    $("inputFrame" + tstCurrentPage).style.height = 0.8 * screen.height + "px";
    
    $("inputFrame" + tstCurrentPage).style.overflowY = 'scroll'

    $("inputFrame" + tstCurrentPage).style.background = "white";
    
    $("inputFrame" + tstCurrentPage).appendChild(htmlElement)
  }
  return {
    append
  }
})()

/**
 * Generates pregnancy detail input table
 */
var PregnancyDetailTableComponent = (() => {
  function buildParentTable() {
    let table = document.createElement('table');
    let tr = document.createElement('tr')
    let pregnancyTH = document.createElement('th')
    let detailsTH = document.createElement('th')
    table.className = 'pregancy-details-table';
    pregnancyTH.innerHTML = 'Pregnancy'
    detailsTH.innerHTML = 'Details'
    tr.appendChild(pregnancyTH)
    tr.appendChild(detailsTH)
    table.appendChild(tr)
    return table
  }
  
  function checkFirstFormSelectionItem() {
    let items = document.getElementsByClassName('pregnancy-details-selection-li');
    if (items) {
      items[0].click()
    }
  }

  function buildPregnancyFormSelector(options) {
    return TT_INPUT_DIALOG.buildRadioOptions(
      options, 'pregnancy-details-selection-li', 
      function(option){
        for(var element of document.getElementsByClassName('active-pregnancy-detail-fields')) { 
          element.classList.remove('active-pregnancy-detail-fields')
          element.classList.add('inactive-pregnancy-detail-fields');
        }
        document.getElementById(option).classList.add('active-pregnancy-detail-fields');
        document.getElementById(option).classList.remove('inactive-pregnancy-detail-fields');
      });
  }

  /**
   * tableContent {
   *  'Title of data' : [
   *      {
   *          'sectionName': 'string',
   *          'fields': [
   *              {
   *                refID: 'string',
   *                label: 'string,
   *                value: 'string',
   *                edit: 'function'
   *              }
   *           ]
   *      }
   *  ]
   * }
   * @param {*} parentTable
   * @param {*} tableContent
   */
  function buildPregnancyDetailFields(tableContent) {
    let container = document.createElement('div');
    for(var headerName in tableContent) {
      let div = document.createElement('div');
      div.id = headerName;
      // Hide me until someone or something else removes this class from me
      div.classList.add('inactive-pregnancy-detail-fields')

      tableContent[headerName].forEach(function(content) {
        let tableHeadSection = document.createElement('div')
        let table = document.createElement('table')
        table.classList.add('value-table')

        // Nice title header for a form
        if (typeof content.sectionName === 'string') {
          tableHeadSection.className = 'table-head-section';
          tableHeadSection.innerHTML = content.sectionName;
          div.appendChild(tableHeadSection);
        }

        content.fields.forEach(function(field) {
          let fieldTr = document.createElement('tr');
          let labelTD = document.createElement('td');
          let valueTD = document.createElement('td');
          let textInput = document.createElement('input');
          let onEdit = function () {
            field.edit(GlobalPageData.pregDetailsPage.components[field.refID],
              Object.values(GlobalPageData.pregDetailsPage.components).filter(function(groupField) {
                return groupField.groupID === content.groupID
              }));
          }

          if (typeof field.label === 'string') {
            labelTD.innerHTML = field.label;
          }

          if (typeof field.edit === 'function') {
            textInput.readOnly = true;
            textInput.placeholder = 'Edit ' + field.label;
            textInput.style.fontSize = '1.4rem';
            textInput.style.padding = '8px';
            textInput.style.backgroundColor = '#F8F8F8';
            textInput.setAttribute('onmousedown', 'GlobalPageData.pregDetailsPage.methods["' + field.refID + '"]()')
            valueTD.appendChild(textInput)
          }

          let value = null;
          // get refID data history and preload everything below
          let fieldData = GlobalPageData.pregDetailsPage.components[field.refID];
          let fieldIsHidden = false;
          let computedValues = null;
          if (fieldData) {
            /**
             * Prepopulate data if available
             */
            if(fieldData.value != null) {
              value = fieldData.value;
              textInput.value = fieldData.value.label || fieldData.value.value;
            }
            computedValues = fieldData.computedValue;
            fieldIsHidden = fieldData.hidden || false; 
          } else {
            fieldIsHidden = field.hidden || false;
          }
          GlobalPageData.pregDetailsPage.components[field.refID] = {
            value: value,
            refID: field.refID,
            groupID: content.groupID,
            hidden: fieldIsHidden,
            label: field.label,
            labelElement: labelTD,
            valueElement: textInput,
            computedValue: computedValues,
            onEdit,
            row: fieldTr
          }
          // Track all refIDs which are active/are shown to the screen. 
          // These IDs are being tracked so that we can cleanup unused components later
          // or can aid in filtering data for active components only
          GlobalPageData.pregDetailsPage.activeFields.push(field.refID);
          GlobalPageData.pregDetailsPage.methods[field.refID] = onEdit;
          // Hide me if hidden
          fieldTr.style.display = fieldIsHidden ? 'none' : '';

          // Show my label color depending if i have data or not
          labelTD.style.color = textInput.value ? 'green' : 'brown';

          fieldTr.appendChild(labelTD);
          fieldTr.appendChild(valueTD);
          table.appendChild(fieldTr);
          div.appendChild(table);
        });
        container.appendChild(div);
      });
    }
    return container;
  }

  function createPregnancyDetailsInput(fieldItems) {
    let parentTable = buildParentTable();
    let pregnancyFormSelector = buildPregnancyFormSelector(Object.keys(fieldItems));
    let pregnancyDetailFields = buildPregnancyDetailFields(fieldItems);
    let tr = document.createElement('tr');
    let tdSelector = document.createElement('td');
    let tdForm = document.createElement('td');
    tdSelector.className = 'value-table-label';
    tdSelector.appendChild(pregnancyFormSelector);
    tdForm.appendChild(pregnancyDetailFields);
    tr.appendChild(tdSelector);
    tr.appendChild(tdForm);
    parentTable.append(tr);
    return parentTable;
  }
  return {
    checkFirstFormSelectionItem,
    createPregnancyDetailsInput
  }
})();

/**
 * Setups Pregnancy input page with field parameters
 */
var PregnancyDetailsPage = (() => {
  function getNumberOrdinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function updateValue(fieldData, val, computedValue, showValue=null) {
    fieldData.value = val;
    fieldData.computedValue = computedValue;
    fieldData.valueElement.value = showValue || val.label || val.value;
    fieldData.labelElement.style.color = 'green';
  }

  function buildPregnancyAbortionForm(groupID) {
    return [
      {
        refID: 'year_abortion_' + groupID,
        label: 'Year of abortion',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_number_input({
            title: 'Year of abortion',
            isRequired: true,
            validation: function (val) {
              if (val.value > abs_max_birth_year || val.value < min_birth_year) {
                return ['Year of abortion must be between ' + min_birth_year + ' and ' + abs_max_birth_year];
              }
            },
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 7996,
                value_numeric: val.value
              })
            }
          })
        }
      },
      {
        refID: 'place_of_abortion_' + groupID,
        label: 'Place of abortion',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Place of abortion',
            isRequired: true,
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 2997, 
                value_text: val.label
              })
            },
            options: [
              { label: "Health facility" },
              { label: "In transit" },
              { label: "TBA" },
              { label: "Home" },
              { label: "Other"}
            ]
          }) 
        }
      },
      {
        refID: 'type_of_abortion_' + groupID,
        label: 'Type of abortion',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_select({ 
            title: 'Type of abortion',
            isRequired: true,
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 8359, 
                value_coded: val.value
              })
            },
            options: [
              { label: "Complete abortion", value: 7372 }, 
              { label: "Incomplete abortion", value: 905 }
            ]
          })
        }
      },
      {
        refID: 'procedure_done_' + groupID,
        label: 'Procedure done',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Procedure done',
            isRequired: true,
            onfinish: function(value) {
              updateValue(field, value, {
                concept_id: 7439, 
                value_text: value.label
              })
            },
            options: [
              { label: "Manual Vacuum Aspiration (MVA)" },
              { label: "Evacuation" },
              { label: "None" }
            ]
          })
        }
      },
      {
        refID: 'abortion_gestation_weeks_' + groupID,
        label: 'Gestation weeks',
        edit: function (field) {
          TT_INPUT_DIALOG.tt_number_input({
            title: 'Gestation weeks',
            isRequired: true,
            validation: function (val) {
              if (val.value < 0 || val.value > 28) {
                return ['Gestation weeks must be with range of 1 to 28 weeks']
              }
              return null
            },
            onfinish: function(val) {
              updateValue(field, val,{
                concept_id: 44,
                value_numeric: val.value
              })
            }
          })
        }
      }
    ]
  }

  function buildPregnancyDelieveryForm(groupID) {
    return  [
      {
        refID: 'year_of_birth_' + groupID,
        label: 'Year of birth',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_number_input({
            title: 'Year of birth',
            isRequired: true,
            validation: function (val) {
              if (val.value > abs_max_birth_year || val.value < min_birth_year) {
                return ['Year of birth must be between ' + min_birth_year + ' and ' + abs_max_birth_year];
              }
            },
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 7996,
                value_numeric: val.value
              })
            }
          })
        }
      },
      {
        refID: 'place_of_birth_' + groupID,
        label: 'Place of birth',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Place of birth',
            isRequired: true,
            onfinish: function(value) {
              updateValue(field, value, {
                concept_id: 2997, 
                value_text: value.label
              })
            },
            options: [
              { label: "Health facility" },
              { label: "In transit" },
              { label: "TBA" },
              { label: "Home" },
              { label: "Other"}
            ]
          }) 
        }
      },
      {
        refID: 'gestation_weeks_' + groupID,
        label: 'Gestation weeks',
        edit: function (field) {
          TT_INPUT_DIALOG.tt_number_input({
            title: 'Gestation weeks',
            isRequired: true,
            validation: function(val) {
              if (val.value < 5 || val.value > 42) {
                return ['Gestation weeks must be between 5 and 42 weeks']
              }
            },
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 44, 
                value_numeric: val.value
              })
            }
          })
        }
      },
      {
        refID: 'method_of_delievery_' + groupID,
        label: 'Method of delivery',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Method of delivery',
            isRequired: true,
            onfinish: function(value) {
              updateValue(field, value, {
                concept_id: 5630, 
                value_text: value.label
              })
            },
            options: [
              { label: "Spontaneous Vertex" }, 
              { label: "Caesarean Section" }, 
              { label: "Vacuum extraction delivery" }, 
              { label: "Breech" }, 
              { label: "Forceps"}, 
              { label: "Others" }
            ]
          })
        }
      },
      {
        refID: 'condition_at_birth_' + groupID,
        label: 'Condition at birth',
        edit: function(field, otherFields) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Condition at birth',
            isRequired: true,
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 7998, 
                value_text: val.label
              })
              otherFields.forEach(function(f) {
                if (f.label ==="Alive now" || f.label === 'Age at death') {
                  if (val.label === 'Alive' && f.label === 'Alive now') {
                    f.row.style.display = '';
                    GlobalPageData.pregDetailsPage.components[f.refID]['hidden'] = false;
                  } else {
                    f.valueElement.value = '';
                    f.row.style.display = 'none';
                    f.labelElement.style.color = 'brown';
                    GlobalPageData.pregDetailsPage.components[f.refID]['value'] = null;
                    GlobalPageData.pregDetailsPage.components[f.refID]['hidden'] = true;
                    GlobalPageData.pregDetailsPage.components[f.refID]['computedValue'] = null;
                  }
                }
              })
            },
            options: [
              { label: "Alive" }, 
              { label: "Macerated Still Birth (MSB)" }, 
              { label: "Fresh Still Birth (FSB)" }
            ]
          })
        }
      },
      {
        refID: 'birth_weight_' + groupID,
        label: 'Birth weight',
        edit: function(field) {
          TT_INPUT_DIALOG.tt_number_input({
            title: 'Birth weight',
            isRequired: true,
            validation: function (val) {
              if (!val.label.match(/unk/i) && (val.value < 1 || val.value > 5)) {
                return ['Birth weight must be between 1 and 5 kgs']
              }
            },
            onfinish: function(value) {
              let onValue = function(val) {
                updateValue(field, val, {
                  concept_id: 5916, 
                  value_text: val.label
                });
              }
              // Estimate baby weight if unknown
              if(value.label.match(/unknown/i)) {
                return TT_INPUT_DIALOG.tt_select({
                  title: 'Birth weight estimate',
                  isRequired: true,
                  options: [
                    { label: "Normal" },
                    { label: "Big baby" },
                    { label: "Small baby" }
                  ],
                  onfinish: function(val) {
                    onValue(val)
                  }
                });
              } else {
                onValue(value)
              }
            }
          },
          { 
            keyReplacements: {
              '0': 'Unk'
            } 
          })
        }
      },
      {
        refID: 'alive_now_' + groupID,
        label: 'Alive now',
        hidden: true,
        edit: function(field, otherFields) {
          TT_INPUT_DIALOG.tt_select({
            title: 'Alive now',
            isRequired: true,
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 2895, 
                value_coded: val.value
              })
              otherFields.forEach(function(f) {
                if (f.label ==="Age at death") {
                  if (val.label === 'No') {
                    f.row.style.display = ''
                    f.onEdit()
                    GlobalPageData.pregDetailsPage.components[f.refID]['hidden'] = false;
                  } else {
                    f.labelElement.style.color = 'brown';
                    f.valueElement.value = '';
                    f.row.style.display = 'none';
                    GlobalPageData.pregDetailsPage.components[f.refID]['value'] = null;
                    GlobalPageData.pregDetailsPage.components[f.refID]['hidden'] = true;
                    GlobalPageData.pregDetailsPage.components[f.refID]['computedValue'] = null;
                  }
                }
              })
            },
            options: [
              { label: "Yes", value: 1065 },
              { label: "No", value: 1066 }
            ]
          })
        }
      },
      {
        refID: 'age_at_death_' + groupID,
        label: 'Age at death',
        hidden: true,
        edit: function(field) {
          TT_INPUT_DIALOG.tt_time_duration({
            title: 'Age at death',
            isRequired: true,
            onfinish: function(val) {
              updateValue(field, val, {
                concept_id: 7999,
                value_text: val.value
              }, val.value)
            }
          })
        }
      }
    ];
  }

  /**
   * @param {
   *  {
   *    1: {
   *      condition: "boolean",
   *      count: "number"
   *    }
   *  }
   * } delieveries 
   */
  function generateDelieveryFields(delieveries) {
    let delieveryHash = {}
    for (let key in delieveries) {
      let label = "<span>" + key + '<sup>' + getNumberOrdinal(key) + '</sup> Delievery</span>';
      if (!delieveries[key].condition) { 
        continue
      }
      delieveryHash[label] = [];
      for(let i=0; i < delieveries[key].count; i++) { 
        let id = 'delivery_num_' + key + '_baby_num_' + i;
        let num = i + 1
        delieveryHash[label].push({
          groupID: id,
          sectionName: "<span>" + num + '<sup>' + getNumberOrdinal(num) + '</sup> Baby for ' + label + ' </span>',
          fields: buildPregnancyDelieveryForm(id)
        })
      }
    }
    return delieveryHash
  }

  /**
   * 
   * @param {number} gravida
   * @param {number} para
   * @returns {object}
   */
  function generateAbortionFields(gravida, para) {
    let abortionCount = (gravida - para) - 1
    let abortionHash = {}
    for (let i=0; i < abortionCount; ++i) {
      let num = i + 1
      let label = '<span style="color:red;">' + num + '<sup>' + getNumberOrdinal(num) + '</sup> Abortion</span>'
      abortionHash[label] = [
        {
          groupID: 'abortion_fields_'+ num,
          fields: buildPregnancyAbortionForm(num)
        }
      ];
    }
    return abortionHash;
  }

  function activeFields() {
    return GlobalPageData.pregDetailsPage['activeFields'];
  }

  function isFormComplete() {
    return activeFields().every(function(refID) { 
      const data = GlobalPageData.pregDetailsPage.components[refID]
      return data.hidden ? true : data.value != null
    });
  }

  /**
   * Generate observations from computedValues generated by fields
   * @returns 
   */
  function getObservations() {
    let obs = [];
    for (let refID of activeFields()) {
      let data = GlobalPageData.pregDetailsPage.components[refID];
      if (data.computedValue) {
        obs.push(data.computedValue);
      }
    }
    return obs;
  }

  /**
   * 
   * @param {number} gravida 
   * @param {number} para 
   * @param {
   *  {
   *    1: {
   *      condition: "boolean",
   *      count: "number"
   *    }
   *  }
   * } delieveries 
   */
  function showPregnancyDetails(gravida, para, delieveriesData) {
    try {
      // Reset tracked field names
      GlobalPageData.pregDetailsPage.activeFields = [];
      let delieveries = generateDelieveryFields(delieveriesData);
      let abortions = generateAbortionFields(gravida, para);
      let fields = Object.assign({}, delieveries, abortions);
      let table = PregnancyDetailTableComponent.createPregnancyDetailsInput(fields);
      InputFrame.append(table);
      PregnancyDetailTableComponent.checkFirstFormSelectionItem();
      let btn = document.getElementById('nextButton')
      GlobalPageData.pregDetailsPage.methods.setPregnancyNextButtonAction = function() {
        if (!isFormComplete()) { 
          TT_ALERT.alertMessage('Please complete all fields marked in red')
        } else {
          gotoNextPage()
        }
      }
      btn.setAttribute('onmousedown', 'GlobalPageData.pregDetailsPage.methods.setPregnancyNextButtonAction()')
    } catch (e) {
      console.error(e);
    }
  }

  return {
    showPregnancyDetails,
    getObservations,
    isFormComplete
  }
})()


function fetchGravidaValue() {
  GET({
    url: apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/observations',
    async: true,
    headers: {
      'Authorization': sessionStorage.authorization
    }
  },
  {
    person_id: patientID,
    concept_id: 1755,
    date: sessionDate
  },
  function (data) {
    if (data.length > 0) {
      lastGravida = data[0].value_numeric;
      document.getElementById('touchscreenInput'+tstCurrentPage).value = lastGravida + 1;
    }
  },
  function (error) {
    console.error(error)
  })
}

function submitButton(){
  var nextButton = document.getElementById('nextButton');

  nextButton.setAttribute('onmousedown', 'nextRoute()');

}

function nextRoute(){

  var gravida = $('touchscreenInput'+tstCurrentPage).value;

  gravida_value = gravida;

  if (lastGravida && gravida && parseInt(gravida) <= parseInt(lastGravida)) { 

    TT_ALERT.alertMessage(`Please enter value greater than last Gravida of ${lastGravida}`);

  } else if (gravida !== "" && parseInt(gravida) === 1){

    submitObstetricEncounter();

  } else {

    gotoNextPage();

  }

}
      
function changeSubmitFunction(){
  
  var nextButton = document.getElementById('nextButton');
  
  nextButton.setAttribute('onmousedown', 'submitObstetricEncounter()');

}

function submitObstetricEncounter(){
        
  var currentTime = moment().format(' HH:mm:ss');
        
  var encounter_datetime = moment(sessionDate).format('YYYY-MM-DD'); 
        
  encounter_datetime += currentTime;

  var encounter = {
      encounter_type_name: 'OBSTETRIC HISTORY',
      encounter_type_id:  82,
      patient_id: patientID,
      encounter_datetime: encounter_datetime
    }
    
  submitParameters(encounter, "/encounters", "postObstetricObs");
      
}

function postObstetricObs(encounter){
  
  pushed = [];
  
  var obs = {
      encounter_id: encounter.encounter_id,
      observations: [
          {concept_id: 1755, value_numeric: parseInt(gravida_value)}
        ]
      };
      
  try{
    if ($('gravida').value > 1 && $('para').value !== 'Unknown') {
      obs.observations = obs.observations.concat(PregnancyDetailsPage.getObservations())
    }

    if ($('para').value !== ""){
      obs.observations.push(
        {concept_id: 1053, value_numeric: parseInt($('para').value)}
      );       
    }
        
    if ($('abortions').value !== "" && parseInt($('abortions').value) > 0) {
            
      obs.observations.push(
        {concept_id: 7942, value_numeric: parseInt($('abortions').value)}
      );
  
    }
    
    for(key in prev_complications){

      if (prev_complications[key] !== ""){
        
        obs.observations.push({concept_id: key, value_coded: prev_complications[key]});

      }

    }
 
  }catch(e){
          
    console.log(e);
        
  }
  
  submitParameters(obs, "/observations", "nextPage");

}

function nextPage(){
        
  nextEncounter(sessionStorage.patientID, sessionStorage.programID);
      
}

function increment(pos) {
  
  var i = parseInt(__$("input_" + pos).value);
        
  if (i <= 3) {
    
    __$("input_" + pos).value = parseInt(__$("input_" + pos).value) + 1;
          
    updateInput(pos);
        
  } else {
    
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.background = "url('/apps/ANC/assets/images/up_arrow_gray.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.backgroundRepeat = "no-repeat";
        
  }
  
  if (i + 1 == 13) {
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.background = "url('/apps/ANC/assets/images/up_arrow_gray.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.backgroundRepeat = "no-repeat";
        
  }
  
  if (i + 1 > 1) {
          
    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.background = "url('/apps/ANC/assets/images/down_arrow.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.backgroundRepeat = "no-repeat";
        
  }
      
}

function decrement(pos) {
  
  var i = parseInt(__$("input_" + pos).value);
        
  if (parseInt(__$("input_" + pos).value) > 1) {

    __$("input_" + pos).value = parseInt(__$("input_" + pos).value) - 1;
          
    updateInput(pos);
        
  } else {
    
    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.background = "url('/apps/ANC/assets/images/down_arrow_gray.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.backgroundRepeat = "no-repeat";
        
  }
  
  if (i - 1 == 1) {

    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.background = "url('/apps/ANC/assets/images/down_arrow_gray.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[0].childNodes[0].style.backgroundRepeat = "no-repeat";
        
  }
  
  if (i - 1 < 13) {
          
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.background = "url('/apps/ANC/assets/images/up_arrow.png')";
          
    __$("input_" + pos).parentNode.parentNode.children[2].childNodes[1].style.backgroundRepeat = "no-repeat";
        
  }
      
}

function checkSelection(pos) {
  
  if (__$("img_" + pos).src.match(/unticked/)) {

    __$("img_" + pos).src = "/apps/ANC/assets/images/ticked.jpg";
          
    updateInput(pos, true);
        
  } else {
    
    __$("img_" + pos).src = "/apps/ANC/assets/images/unticked.jpg";
          
    updateInput(pos, false);
        
  }
      
}

function updateInput(pos, bool) {
  
  if (data[pos] == undefined) {

    data[pos] = {};
        
  }
  
  data[pos]["count"] = parseInt(__$("input_" + pos).value);

  if (bool != undefined)
          
    data[pos]["condition"] = bool;

  __$("data").value = stringfy(data);
      
}

function stringfy(hash) {

  var keys = Object.keys(hash);
        
  var vals = "{";
        
  var cons = "{";

  for (var i = 0; i < keys.length; i++) {

    vals += keys[i] + " => ";
          
    cons += keys[i] + " => ";

    if (i != keys.length - 1) {

      vals += data[keys[i]]["count"] + ", ";
            
      cons += data[keys[i]]["condition"] + ", ";
          
    } else {

      vals += data[keys[i]]["count"] + "}";
            
      cons += data[keys[i]]["condition"] + "}";
          
    }
        
  }
  
  var string = "{'values' => " + vals + ", 'conditions' => " + cons + "}";

  return string;
      
}

function loadSelections() {
        
  $("keyboard").style.display = "none";
        
  $("touchscreenInput" + tstCurrentPage).style.display = "none";
        
  $("inputFrame" + tstCurrentPage).style.height = 0.72 * screen.height + "px";
        
  $("inputFrame" + tstCurrentPage).style.marginTop = 0.05 * screen.height + "px";
        
  $("inputFrame" + tstCurrentPage).style.background = "white";

  var delivered_pregnancies = $("para").value;

  if (delivered_pregnancies > 0) {
          
    var headerHolder = document.createElement("div");
          
    headerHolder.style.height = "63px";
          
    headerHolder.style.width = "100%";
          
    headerHolder.style.borderRadius = "10px";

          
    var header = document.createElement("div");
          
    header.id = "header";
          
    header.style.width = "100%";
          
    headerHolder.appendChild(header);

          
    var t1 = document.createElement("div");
          
    t1.innerHTML = "Pregnancy";
          
    t1.setAttribute("class", "h-cell");
          
    header.appendChild(t1);

          
    var t2 = document.createElement("div");
          
    t2.innerHTML = "Baby count";
          
    t2.setAttribute("class", "h-cell");
          
    header.appendChild(t2);

          
    var t3 = document.createElement("div");
          
    t3.innerHTML = "Details available";
          
    t3.setAttribute("class", "h-cell");
          
    header.appendChild(t3);

          
    $("inputFrame" + tstCurrentPage).appendChild(headerHolder);

          
    var container = document.createElement("div");
          
    container.style.height = 0.64 * screen.height + "px";
          
    container.id = "container";

          
    $("inputFrame" + tstCurrentPage).appendChild(container);
          
    var table = document.createElement("div");
          
    table.id = "table";

          
    container.appendChild(table);

          
    for (var p = 1; p <= delivered_pregnancies; p++) {
            
      var row = document.createElement("div");
            
      row.setAttribute("class", "data-row");
            
      row.id = "row_" + p;
            
      if (p % 2 == 1) {
              
        row.style.background = "#F8F8F8";
            
      }
            
      table.appendChild(row);

            
      var cell1 = document.createElement("div");
            
      cell1.id = "cell_" + p + "_1";
            
      cell1.style.paddingLeft = "15%";
            
      cell1.setAttribute("class", "data-cell");
            
      cell1.innerHTML = p + (p == 1 ? "<sup>st</sup>" : ((p == 2 ? "<sup>nd</sup>" : (p == 3 ? "<sup>rd</sup>" : "<sup>th</sup>"))));
            
      row.appendChild(cell1);

            
      var cell2 = document.createElement("div");
            
      cell2.id = "cell_" + p + "_2";
            
      cell2.setAttribute("class", "data-cell");

      cell2.style.paddingLeft = "7%";

            
      cell2.innerHTML = "<table class='button-table'><tr><td><button id = 'inc" + p + "' class = 'minus' onmousedown = 'decrement(" + p + ")'></button> </td> <td><input id = 'input_" +
              p + "'  value = '" + (counts[p] == undefined ? 1 : counts[p]) + "' class = 'label' id = 'label" + p + "' >  </input> </td><td> <button  id = 'dec" + p + "' class = 'plus' onmousedown = 'increment(" + p + ")'></button></td></tr></table>"
       
      row.appendChild(cell2);
      
      if (counts[p] != undefined && parseInt(counts[p]) > 1) {
              
        $("inc" + p).style.background = "url('/apps/ANC/assets/images/down_arrow.png')";
              
        $("inc" + p).style.backgroundRepeat = "no-repeat";
            
      } else {
              
        $("inc" + p).style.background = "url('/apps/ANC/assets/images/down_arrow_gray.png')";
              
        $("inc" + p).style.backgroundRepeat = "no-repeat";
            
      }

      if (counts[p] != undefined && parseInt(counts[p]) == 13) {
              
        $("dec" + p).style.background = "url('/apps/ANC/assets/images/up_arrow_gray.png')";
              
        $("dec" + p).style.backgroundRepeat = "no-repeat";
           
      } else {
              
        $("dec" + p).style.background = "url('/apps/ANC/assets/images/up_arrow.png')";
              
        $("dec" + p).style.backgroundRepeat = "no-repeat";
            
      }
      
      var cell3 = document.createElement("div");
            
      cell3.id = "cell_" + p + "_3";
            
      cell3.setAttribute("class", "data-cell-img");
            
      cell3.setAttribute("p", p);
            
      cell3.innerHTML = '<img class = "dcimg" id = "img_' + p + '" onclick = "checkSelection(' + p + ')" src="/apps/ANC/assets/images/unticked.jpg" height="45" width="45"> ';
            
      row.appendChild(cell3);

      if (data[p] == undefined)
              
        data[p] = {};
            
      data[p]["condition"] = false;
            
      data[p]["count"] = 1;
          
    }

    var width = __$("row_1").offsetWidth + "px";
          
    headerHolder.style.width = width;
          
    header.style.width = width;
          
    updateInput(1, false);
        
  }
      
}

function calculateAbortions() {
        
  updateDeliveries();
        
  if ($('gravida').value > 1) {
          
    $('abortions').value = parseInt(__$('gravida').value) - parseInt(__$('para').value) - 1
        
  }
      
}

function updateDeliveries() {
        
  deliveries = __$('para').value;
      
}

function test_code() {
      
  result = details_available.length;
  
  details_available = []
  
  return result;
  
}

function buildParams() {

  var keys = Object.keys(data)

  for (var i = 0; i < keys.length; i++) {

    var count = data[keys[i]]["count"];

    for (var c = 1; c <= count; c++) {
          
      if (data[keys[i]] == undefined)
      
      data[keys[i]] = {};
      
      if (data[keys[i]][c] == undefined)
      
      data[keys[i]][c] = {};
      
    }
    
  }

  var abortions = parseInt(__$("abortions").value);
      
  if (abortions > 0) {
        
    for (var i = 1; i <= abortions; i++) {
    
      if ($$[i] == undefined)
    
      $$[i] = {};
    
    }
    
  }


  // update various fields

  __$("data_obj").value = JSON.stringify(data);

  __$("abortion_obj").value = JSON.stringify($$);


  var str = __$("data_obj").value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s+]/g, ' ')


  if (str.match(/caesarean section/i)) {

    __$("ever_had_c_sections").value = "Yes";

  } else {

    __$("ever_had_c_sections").value = "No";

  }


  if (str.match(/vacuum extraction delivery/i)) {

    __$("ever_had_a_vacuum_extraction").value = "Yes";

  } else {

    __$("ever_had_a_vacuum_extraction").value = "No";

  }


  if (str.match(/still birth/i)) {

    __$("ever_had_still_births").value = "Yes";

  } else {

    __$("ever_had_still_births").value = "No";

  }

}

function loadSplitSelections() {
  x = []
  //array format [url, input_id, helpText]
  var arr = [

    [["Yes", "No"].join('|'), "ever_had_episiotomy"],

    [["No|APH|PPH"].join("|"), "hemorrhage"],

    [["Yes", "No"].join('|'), "pre_eclampsia"],

    [["Yes", "No"].join('|'), "eclampsia"]

  ];

  var count = arr.length;

  var n = Math.floor(Math.sqrt(count));

  var v_count = Math.ceil(count / n);

  var h_count = Math.ceil(count / n);

  var e_count = count % n;


  __$("keyboard").style.display = "none";

  __$("touchscreenInput" + tstCurrentPage).style.display = "none";

  __$("inputFrame" + tstCurrentPage).style.height = (0.72 * screen.height) + "px";

  __$("inputFrame" + tstCurrentPage).style.marginTop = (0.05 * screen.height) + "px";

  //__$("inputFrame" + tstCurrentPage).style.background = "lightblue";

  if (count > 0) {
        
    var n = 0;
    
    var holder = document.createElement("div");
    
    holder.id = 'holder';
    
    holder.style.height = (0.72 * screen.height) + "px";
    
    holder.style.width = "100%";
    
    holder.style.display = "none";
    
    holder.setAttribute("class", "options");
    
    holder.style.borderRadius = "5px";
    
    holder.style.background = "white";
    
    __$("inputFrame" + tstCurrentPage).appendChild(holder);
        
    for (var r = 1; r <= v_count; r++) {
          
      var row = document.createElement("div");
      
      row.id = r;
      
      row.style.display = "table-row";
      
      row.setAttribute("class", "row");
      
      holder.appendChild(row);
          
      for (var c = 1; c <= h_count; c++) {
            
        var cell = document.createElement("div");
        
        cell.id = r + "_" + c;
        
        cell.style.display = "table-cell";
        
        cell.setAttribute("class", "cell");
        
        cell.style.background = "white";

        var helpText = __$(arr[n][1]).getAttribute("helpText");
        
        var heada = document.createElement("div");
        
        heada.style.height = "40px";
        
        heada.innerHTML = helpText;
        
        heada.style.marginTop = "5px";
        
        heada.style.background = "#CFE4CD";
        
        heada.style.borderRadius = "3px";
        
        heada.style.border = "2px gray solid";
        
        heada.style.fontSize = "28px";
        
        heada.style.marginLeft = "5px";
        
        heada.style.marginRight = "5px";
        
        cell.appendChild(heada);
            
        if (c != 1) {
        
          cell.style.borderLeft = "1px solid";
        
        }
            
        if (r != 1) {
        
          cell.style.borderTop = "1px solid";
        
        }
         
        cell.style.height = ((72 / v_count) - 2) * 0.001 * screen.height + "px";
        
        cell.style.width = ((100 / h_count)) + "%";
        
        row.appendChild(cell);
            
        n++;
        
        if (n != arr.length - 1) {
              
          //ajaxCustomRequest(arr[n - 1][0], arr[n - 1][1], "", (r + "_" + c));
          handleCustomResult(arr[n - 1][0], arr[n - 1][1], "", (r + "_" + c));

        } else {
              
          //ajaxCustomRequest(arr[n - 1][0], arr[n - 1][1], "table", (r + "_" + c));
          handleCustomResult(arr[n - 1][0], arr[n - 1][1], "table", (r + "_" + c)); 

        }

      }
      
    }

    __$("2_2").style.display = "none";

    __$("1_2").style.borderBottom = "1px solid";

    __$("2_1").style.borderRight = "1px solid";

  }
  
}

function ajaxCustomRequest(aUrl, id, n, dom_id) {

  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {

    handleCustomResult(httpRequest, id, n, dom_id);

  };
  //try {
  
  httpRequest.open('GET', aUrl, true);
  
  httpRequest.send(null);
  
  //} catch (e) {
  
  //console.log(e);
  
  //}
  
}

function handleCustomResult(result, id, n, dom_id) {

    var data = result.split("|");

    if (x.includes(id))

      return

    x.push(id);

    var ul = document.createElement("ul");

    ul.id = id + "_ul"

    ul.style.paddingLeft = "5px";

    ul.style.paddingRight = "5px";

    __$(dom_id).appendChild(ul);

    var items = [];

    for (var i = 0; i < data.length; i++) {

      var li = document.createElement("li");

      li.setAttribute("class", "cell-data");

      li.setAttribute("target", id);

      li.value = data[i];

      ul.appendChild(li);

      li.setAttribute("value", data[i]);

      li.innerHTML = "<img height=34 style='margin-right: 10px; margin-bottom: -5px;' src='/public/touchscreentoolkit/lib/images/unchecked.png' />" + data[i];

      items.push(li)

      li.onmousedown = function () {

        __$(this.getAttribute("target")).value = this.getAttribute("value");

        if (prev_complications[concepts_hash[this.getAttribute("target")]] == undefined){

          prev_complications[concepts_hash[this.getAttribute("target")]] = "";

        }

        prev_complications[concepts_hash[this.getAttribute("target")]] = concepts_hash[this.getAttribute("value")];


        if (this.getAttribute("target") == 'pre_eclampsia' && this.innerHTML.match(/Yes/i)) {

          __$("2_2").style.display = "table-cell";

          __$("2_2").style.opacity = 1;

          __$("1_2").style.borderBottom = "hidden";

          __$("2_1").style.borderRight = "hidden";

        } else if (this.getAttribute("target") == 'pre_eclampsia' && this.innerHTML.match(/No/i)) {

          __$("eclampsia").value = "";

          __$("1_2").style.borderBottom = "1px solid";

          __$("2_1").style.borderRight = "1px solid";

          hideMsg("2_2");

        }

        updateTouchscreenInput(this);

        var target = this.getAttribute("target")

        var nodes = jQuery("[target=" + target + "]");

        for (var i = 0; i < nodes.length; i++) {

          nodes[i].getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/unchecked.png';

        }

        this.getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/checked.png';

      }

      if (i % 2 == 0) {

        li.className = "even";

        li.setAttribute("group", "even");

      } else {

        li.className = "odd";

        li.setAttribute("group", "odd");

      }

    }

    for (var j = 0; j < items.length; j++) {

      if (__$(id).value && __$(id).value == items[j].getAttribute("value")) {

        updateTouchscreenInput(items[j]);

        __$(items[j].getAttribute("target")).value = items[j].getAttribute("value");

        var nodes = jQuery("[target=" + id + "]");

        for (var i = 0; i < nodes.length; i++) {

          nodes[i].getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/unchecked.png';

        }

        items[j].getElementsByTagName("img")[0].src = '/public/touchscreentoolkit/lib/images/checked.png';

        if (items[j].getAttribute("target") == "pre_eclampsia" && __$("pre_eclampsia").value == "Yes") {

          __$("pre_eclampsia").value = "";

          __$("2_2").style.display = "block";

          items[j].onmousedown.apply(items[j]);

        }

      }

    }

    if (n == "table")

    setTimeout(function () {

      __$('holder').style.display = n;

    }, 150);

}

function fade(div, opacity) {

  __$(div).style.opacity = opacity;

  if (opacity >= 0) {

    opacity = opacity - 0.01;

    setTimeout(function () {

      fade(div, opacity)

    }, 1)

  } else {

    __$(div).style.display = "none";

  }

}

function fadeOut(div, opacity) {

  __$(div).style.opacity = opacity;

  if (opacity <= 1) {

    opacity = opacity + 0.01;

    setTimeout(function () {

      fade(div, opacity)

    }, 5)

  }

}
function showMsg(div) {

  setTimeout(function () {

    fadeOut(div, 0);

  }, 1);

}

function hideMsg(div){
    
  addValidationInterval
    
  __$(div).style.display = "none"

}

function addValidationInterval(){
  
  __$("nextButton").onmousedown = function(){
        
    if (this.innerHTML.match(/Finish/i)){
            
      var arr = ["ever_had_episiotomy", "hemorrhage", "pre_eclampsia"];
            
      try{
                
        if (__$("2_2") != undefined && __$("2_2").style.display != "none"){
                    
          arr.push("eclampsia");
                
        }
            
      }catch(x){}

      var check = 0;
            
      for (var i = 0; i < arr.length; i ++){
        
        var node = __$(arr[i]);
                
        if (node != undefined && (node.value == "" || node.value == undefined || node.value.length < 2)){
                    
          check = check + 1;
                
        }
            
      }
       
      if (check > 0){
                
        alertMessage("Select all fields to proceed");
            
      }else{
        
        gotoNextPage();
            
      }
        
    }else{
            
      gotoNextPage();
       
    }
    
  }

}

// function to update age_units value

setInterval(function () {

  try {

    age_units = __$('unit').value.toLowerCase();

  } catch (error) {

    //console.error(error);

  }

  //console.log(mother_age);

}, 200);

setInterval(function(){
  try{
    
    if (prev_complications["7156"] !== undefined){

      if (prev_complications["7941"] == 1066){

        delete prev_complications["7156"];

      }

    }

  }catch(e){
    console.log(e);
  }
}, 300);