var chartNazione = null;
var chartRegione = null;
var chartRegione = null;

var responseNazioni = null;
var responseRegioni = null;
var responseProvince = null;

const RegioniCallObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json',
  asynchronous: true,
}

const ajaxcallObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json',
  asynchronous: true,
}

const ProvinciaCallObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json',
  asynchronous: true,
}

const NationsCallObj = {
  method: 'GET',
  url: 'https://cors-anywhere.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/casedistribution/json/',
  asynchronous: false,
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function formatDate(date){
    var res = date.substring(0, 10);
    var values = res.split("-");
    var finalDate = values[2] + "/" + values[1] + "/" + values[0];

    return finalDate;
}

function getResource(call, callback, nazione){
  $('.loaderBox').css('display','block');
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response, nazione);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
  $('.loaderBox').css('display','none');
}

function fillNations(nazioneCookie){
  var resp = JSON.parse('["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua_and_Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire", "Bosnia_and_Herzegovina", "Botswana", "Brazil", "British_Virgin_Islands", "Brunei_Darussalam", "Bulgaria", "Burkina_Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape_Verde", "Cases_on_an_international_conveyance_Japan", "Cayman_Islands", "Central_African_Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa_Rica", "Cote_dIvoire", "Croatia", "Cuba", "Curaao", "Cyprus", "Czechia", "Democratic_Republic_of_the_Congo", "Denmark", "Djibouti", "Dominica", "Dominican_Republic", "Ecuador", "Egypt", "El_Salvador", "Equatorial_Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland_Islands_(Malvinas)", "Faroe_Islands", "Fiji", "Finland", "France", "French_Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea_Bissau", "Guyana", "Haiti", "Holy_See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle_of_Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New_Caledonia", "New_Zealand", "Nicaragua", "Niger", "Nigeria", "North_Macedonia", "Northern_Mariana_Islands", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua_New_Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto_Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint_Kitts_and_Nevis", "Saint_Lucia", "Saint_Vincent_and_the_Grenadines", "San_Marino", "Sao_Tome_and_Principe", "Saudi_Arabia", "Senegal", "Serbia", "Seychelles", "Sierra_Leone", "Singapore", "Sint_Maarten", "Slovakia", "Slovenia", "Somalia", "South_Africa", "South_Korea", "South_Sudan", "Spain", "Sri_Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor_Leste", "Togo", "Trinidad_and_Tobago", "Tunisia", "Turkey", "Turks_and_Caicos_islands", "Uganda", "Ukraine", "United_Arab_Emirates", "United_Kingdom", "United_Republic_of_Tanzania", "United_States_of_America", "United_States_Virgin_Islands", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Western_Sahara", "Yemen", "Zambia", "Zimbabwe"]'
  );

  function fill(item, index, arr){
    if(nazioneCookie.localeCompare(item) == 0)
      $('#country').append('<option selected value="' + item + '">' + item + '</option>');
    else
      $('#country').append('<option value="' + item + '">' + item + '</option>');
  }

  resp.forEach(fill)

  if(nazioneCookie.localeCompare("Italy") == 0)
    getResource(ajaxcallObj, displayNazione);
  else
    getResource(NationsCallObj, displayOtherNazione, nazioneCookie);
}

function fillSelectProvincia(response){
  let resp = JSON.parse(response);
  responseProvince = resp;
  var provinciaCookie = getCookie("provincia");
  var visited = new Array();

  if(provinciaCookie.localeCompare("") == 0){
    document.cookie = "provincia=" + "MB";
    provinciaCookie = "MB"
  }

  function fill(item, index, arr){
    if (!visited.includes(item.sigla_provincia) && item.sigla_provincia != null){
      visited.push(item.sigla_provincia);
    }
  }

  function fillSorted(item){
    if(provinciaCookie.localeCompare(item) == 0)
      $('#SelectProvincia').append('<option selected value="' + item + '">' + item + '</option>');
    else
      $('#SelectProvincia').append('<option value="' + item + '">' + item + '</option>');
  }

  resp.forEach(fill)
  visited.sort();
  visited.forEach(fillSorted)
  displayProvincia(provinciaCookie);
}

function fillSelectNazione(response){
  var start = response.indexOf("{", 2);
  response = response.substring(start, response.length - 2);
  var finalResponse = "[" + response;

  let resp = JSON.parse(finalResponse);
  responseNazioni = resp;
  var nazioneCookie = getCookie("nazione");
  var visitedNations = new Array();

  if(nazioneCookie.localeCompare("") == 0){
    document.cookie = "nazione=" + "Italy";
    nazioneCookie = "Italy"
  }

  function fill(item, index, arr){
    if (!visitedNations.includes(item.countriesAndTerritories)){
      visitedNations.push(item.countriesAndTerritories);
      if(nazioneCookie.localeCompare(item.countriesAndTerritories) == 0){
        $('#country').append('<option selected value="' + item.countriesAndTerritories + '">' + item.countriesAndTerritories + '</option>');
      } else{
        $('#country').append('<option value="' + item.countriesAndTerritories + '">' + item.countriesAndTerritories + '</option>');
      }
    }
  }

  resp.forEach(fill)
  if(nazioneCookie.localeCompare("Italy") == 0)
    getResource(ajaxcallObj, displayNazione);
  else
    getResource(NationsCallObj, displayOtherNazione, nazioneCookie);
}

function fillSelectRegione(response){
  let resp = JSON.parse(response);
  responseRegioni = resp;
  var regioneCookie = getCookie("regione");
  var visited = new Array()

  if(regioneCookie.localeCompare("") == 0){
    document.cookie = "regione=" + "Lombardia";
    regioneCookie = "Lombardia";
  }

  function fill(item, index, arr){
  if (!visited.includes(item.denominazione_regione)){
    visited.push(item.denominazione_regione);
    if(regioneCookie.localeCompare(item.denominazione_regione) == 0)
      $('#SelectRegione').append('<option selected value="' + item.denominazione_regione + '">' + item.denominazione_regione + '</option>');
    else
      $('#SelectRegione').append('<option value="' + item.denominazione_regione + '">' + item.denominazione_regione + '</option>');
    }
  }

  resp.forEach(fill)
  displayRegione(regioneCookie);
}

function displayNazione(response){
  let resp = JSON.parse(response);
  var casi = new Array();
  var dates = new Array();
  var positivi = new Array();
  var decessi = new Array();
  var terapia = new Array();
  var tamponi = new Array();
  var totalePositivi = new Array();
  var dimessiGuariti = new Array();
  var totaleCasi = new Array();
  var dimessiGuariti = new Array();

  function parseDatass(item, index, arr){
    casi.push(item.nuovi_positivi);
    dates.push(item.data);
    decessi.push(item.deceduti);
    terapia.push(item.terapia_intensiva);
    tamponi.push(item.tamponi);
    totalePositivi.push(item.totale_positivi);
    dimessiGuariti.push(item.dimessi_guariti);
    totaleCasi.push(item.totale_casi);
    dimessiGuariti.push(item.dimessi_guariti);
  }

  resp.forEach(parseDatass);

  for(var i = 0; i < dates.length; i++){
    dates[i] = formatDate(dates[i]);
  }

  document.getElementById("ultimoAggiornamento").innerHTML = "Ultimo aggiornamento <br>" + dates[dates.length - 1];

  var guaritiOggi = dimessiGuariti[dimessiGuariti.length - 2] - dimessiGuariti[dimessiGuariti.length - 3];
  var positiviOggi = casi[casi.length - 1];
  var rateoPositivi = positiviOggi - casi[casi.length - 2];
  var decessiOggi = decessi[decessi.length - 1] - decessi[decessi.length - 2];
  var rateoDecessi = decessiOggi - (decessi[decessi.length -2] - decessi[decessi.length -3]);
  var totaleDecessi = decessi[decessi.length - 1];
  var terapiaOggi = terapia[terapia.length - 1];
  var rateoTerapia = terapiaOggi - terapia[terapia.length - 2];
  var tamponiOggi = tamponi[tamponi.length - 1] - tamponi[tamponi.length - 2];
  var rateoTotalePositivi = totalePositivi[totalePositivi.length-1] -totalePositivi[totalePositivi.length-2];

  var percentualeContagi = (positiviOggi * 100) / tamponiOggi;
  percentualeContagi = percentualeContagi.toFixed(2);

  var ctx = document.getElementById('AndamentoGenerale').getContext('2d');
  if(chartNazione)
    chartNazione.destroy();
  chartNazione = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: dates,
          datasets: [{
              label: 'Contagi',
              backgroundColor: 'rgb(25, 94, 131)',
              borderColor: 'rgb(25, 94, 131)',
              data: casi
          }]
      },

      // Configuration options go here
      options: {}
  });

  var positiviNazionale = Circles.create({
    id:                  'positivi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return positiviOggi + "<br>" + (rateoPositivi<0?"":"+") + rateoPositivi;},
    colors:              ["green", "#ec716f"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var decessiNazionale = Circles.create({
    id:                  'decessi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return decessiOggi + "<br>" + (rateoDecessi<0?"":"+") + rateoDecessi;},
    colors:              ['red', 'black'],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var terapiaNazionale = Circles.create({
    id:                  'terapia',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return terapiaOggi + "<br>" + (rateoTerapia<0?"":"+") + rateoTerapia;},
    colors:              ["orange"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var guariti = Circles.create({
    id:                  'guaritiNaz',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return guaritiOggi;},
    colors:              ["#427bf5"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totGuariti = Circles.create({
    id:                  'totGuaritiNaz',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return dimessiGuariti[dimessiGuariti.length -1];},
    colors:              ["#42cbf5"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var tamponiNazionale = Circles.create({
    id:                  'tamponi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return tamponiOggi + "<br>" + (percentualeContagi<0?"":"") + percentualeContagi + "%";},
    colors:              ["lightblue"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });


  var TotCasiNazionale = Circles.create({
    id:                  'totPositivi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return totalePositivi[totalePositivi.length - 1] + "<br>" + (rateoTotalePositivi<0?"":"+") + rateoTotalePositivi;},
    colors:              ["lightgreen"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totDecessi = Circles.create({
    id:                  'totDecessi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return totaleDecessi;},
    colors:              ["darkred"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totCasi = Circles.create({
    id:                  'totCasiNaz',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return totaleCasi[totaleCasi.length -1];},
    colors:              ["#5828a6"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });
}

function callRegione(call, callback, regione){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response, regione);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function displayOtherNazione(response, nazioneCookie){
  var start = response.indexOf("{", 2);
  response = response.substring(start, response.length - 2);
  var finalResponse = "[" + response;

  let resp = JSON.parse(finalResponse);
  var casi = 0;
  var dates = new Array();
  var positivi = new Array();
  var decessi = new Array();
  var totaleDecessi = 0;

  function parseDatass(item, index, arr){
    if(nazioneCookie.localeCompare(item.countriesAndTerritories) == 0){
      positivi.push(item.cases);
      dates.push(item.dateRep);
      decessi.push(item.deaths);
      casi += item.cases;
      totaleDecessi += item.deaths;
    }
  }

  resp.forEach(parseDatass);

  positivi.reverse();
  dates.reverse();
  decessi.reverse();

  document.getElementById("ultimoAggiornamento").innerHTML = "Ultimo aggiornamento <br>" + dates[dates.length - 1];

  var positiviOggi = positivi[positivi.length - 1];
  var rateoPositivi = positiviOggi - positivi[positivi.length - 2];
  var decessiOggi = decessi[decessi.length - 1];
  var rateoDecessi = decessiOggi - (decessi[decessi.length -2]);

  var ctx = document.getElementById('AndamentoGenerale').getContext('2d');

  if(chartNazione)
    chartNazione.destroy();
  chartNazione = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: dates,
          datasets: [{
              label: 'Contagi',
              backgroundColor: 'rgb(25, 94, 131)',
              borderColor: 'rgb(25, 94, 131)',
              data: positivi
          }]
      },

      options: {}
  });

  var positiviNazionale = Circles.create({
    id:                  'positivi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return positiviOggi + "<br>" + (rateoPositivi<0?"":"+") + rateoPositivi;},
    colors:              ["green", "#ec716f"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var decessiNazionale = Circles.create({
    id:                  'decessi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return decessiOggi + "<br>" + (rateoDecessi<0?"":"+") + rateoDecessi;},
    colors:              ['red', 'black'],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totDecessi = Circles.create({
    id:                  'totDecessi',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return totaleDecessi;},
    colors:              ["darkred"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totCasi = Circles.create({
    id:                  'totCasiNaz',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return casi;},
    colors:              ["#5828a6"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });
}

function callRegione(call, callback, regione){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response, regione);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function displayRegione(regione){
  var casi = new Array();
  var dates = new Array();
  var positivi = new Array();
  var decessi = new Array();
  var terapia = new Array();
  var tamponi = new Array();
  var totalePositivi = new Array();
  var dimessiGuariti = new Array();
  var totaleCasi = new Array();

  function parseDatass(item, index, arr){
    if(regione.localeCompare(item.denominazione_regione) == 0){
      casi.push(item.nuovi_positivi);
      dates.push(item.data);
      decessi.push(item.deceduti);
      terapia.push(item.terapia_intensiva);
      tamponi.push(item.tamponi);
      totalePositivi.push(item.totale_positivi);
      dimessiGuariti.push(item.dimessi_guariti);
      totaleCasi.push(item.totale_casi);
    }
  }

  responseRegioni.forEach(parseDatass);

  for(var i = 0; i < dates.length; i++){
    dates[i] = formatDate(dates[i]);
  }

  var guaritiOggi = dimessiGuariti[dimessiGuariti.length - 1] - dimessiGuariti[dimessiGuariti.length - 2];
  var positiviOggi = casi[casi.length - 1];
  var rateoPositivi = positiviOggi - casi[casi.length - 2];
  var decessiOggi = decessi[decessi.length - 1] - decessi[decessi.length - 2];
  var rateoDecessi = decessiOggi - (decessi[decessi.length -2] - decessi[decessi.length -3]);
  var totaleDecessi = decessi[decessi.length - 1];
  var terapiaOggi = terapia[terapia.length - 1];
  var rateoTerapia = terapiaOggi - terapia[terapia.length - 2];
  var tamponiOggi = tamponi[tamponi.length - 1] - tamponi[tamponi.length - 2];
  var rateoTotalePositivi = totalePositivi[totalePositivi.length-1] -totalePositivi[totalePositivi.length-2];

  var percentualeContagi = (positiviOggi * 100) / tamponiOggi;
  percentualeContagi = percentualeContagi.toFixed(2);

  var ctx = document.getElementById('AndamentoGeneraleRegione').getContext('2d');
  if(chartRegione)
    chartRegione.destroy();
  chartRegione = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: dates,
          datasets: [{
              label: 'Contagi',
              backgroundColor: 'rgb(25, 94, 131)',
              borderColor: 'rgb(25, 94, 131)',
              data: casi
          }]
      },

      // Configuration options go here
      options: {}
  });


  var positiviNazionale = Circles.create({
    id:                  'positiviReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return positiviOggi + "<br>" + (rateoPositivi<0?"":"+") + rateoPositivi;},
    colors:              ["green", "#ec716f"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var decessiNazionale = Circles.create({
    id:                  'decessiReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return decessiOggi + "<br>" + (rateoDecessi<0?"":"+") + rateoDecessi;},
    colors:              ['red', 'black'],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var terapiaNazionale = Circles.create({
    id:                  'terapiaReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return terapiaOggi + "<br>" + (rateoTerapia<0?"":"+") + rateoTerapia;},
    colors:              ["orange"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var guariti = Circles.create({
    id:                  'guariti',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return guaritiOggi;},
    colors:              ["#427bf5"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totGuariti = Circles.create({
    id:                  'totGuariti',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return dimessiGuariti[dimessiGuariti.length -1];},
    colors:              ["#42cbf5"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var tamponiNazionale = Circles.create({
    id:                  'tamponiReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return tamponiOggi + "<br>" + (percentualeContagi<0?"":"") + percentualeContagi + "%";},
    colors:              ["lightblue"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });


  var TotCasiNazionale = Circles.create({
    id:                  'totPositiviReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return totalePositivi[totalePositivi.length - 1] + "<br>" + (rateoTotalePositivi<0?"":"+") + rateoTotalePositivi;},
    colors:              ["lightgreen"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totDecessi = Circles.create({
    id:                  'totDecessiReg',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               8,
    text:                function(value){return totaleDecessi;},
    colors:              ["darkred"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

var totCasi = Circles.create({
  id:                  'totCasi',
  radius:              90,
  value:               1000,
  maxValue:            100000000,
  width:               10,
  text:                function(value){return totaleCasi[totaleCasi.length -1];},
  colors:              ["#5828a6"],
  duration:            400,
  wrpClass:            'circles-wrp',
  textClass:           'circles-text',
  valueStrokeClass:    'circles-valueStroke',
  maxValueStrokeClass: 'circles-maxValueStroke',
  styleWrapper:        true,
  styleText:           true
});

}


function displayProvincia(provincia){
  var casi = new Array();
  var dates = new Array();
  var positivi = new Array();

  function parseDatass(item, index, arr){
    if(provincia.localeCompare(item.sigla_provincia) == 0){
      casi.push(item.totale_casi);
      dates.push(item.data);
    }
  }

  responseProvince.forEach(parseDatass);

  for(var i = 0; i < dates.length; i++){
    dates[i] = formatDate(dates[i]);
  }

  positivi.push(casi[0]);
  for(var i = 1; i < casi.length; i++){
    positivi.push(casi[i] - casi[i - 1]);
  }

  console.log(casi[casi.length - 1]);

  var casiOggi = casi[casi.length - 1] - casi[casi.length - 2];

  var ctx = document.getElementById('AndamentoGeneraleProvincia').getContext('2d');
  if(chartProvincia)
    chartProvincia.destroy();
  var chartProvincia = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: dates,
          datasets: [{
              label: 'Contagi',
              backgroundColor: 'rgb(25, 94, 131)',
              borderColor: 'rgb(25, 94, 131)',
              data: positivi
          }]
      },

      // Configuration options go here
      options: {}
  });

  var positiviOggi = Circles.create({
    id:                  'positiviPro',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return casiOggi;},
    colors:              ["green", "#ec716f"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });

  var totaleCasiPro = Circles.create({
    id:                  'totaleCasiPro',
    radius:              90,
    value:               1000,
    maxValue:            100000000,
    width:               10,
    text:                function(value){return casi[casi.length - 1];},
    colors:              ["#5828a6"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });
}
