$(document).ready(function() {
    $('#country').select2();
    $('#SelectRegione').select2();
    $('#SelectProvincia').select2();
});

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

const fillRegioneObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json',
  asynchronous: true,
}

const fillProvinciaObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province-latest.json',
  asynchronous: true,
}

const ProvinciaCallObj = {
  method: 'GET',
  url: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json',
  asynchronous: true,
}

function callNazione(call, callback){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function fillRegione(call, callback){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function fillProvincia(call, callback){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function fillSelectProvincia(response){
  let resp = JSON.parse(response);

  function fill(item, index, arr){
    var mb = "MB";
    if(mb.localeCompare(item.sigla_provincia) == 0)
      $('#SelectProvincia').append('<option selected value="' + item.sigla_provincia + '">' + item.sigla_provincia + '</option>');
    else
      $('#SelectProvincia').append('<option value="' + item.sigla_provincia + '">' + item.sigla_provincia + '</option>');
  }

  resp.forEach(fill)
  callProvincia(ProvinciaCallObj, displayProvincia, "MB");
}

function fillSelectRegione(response){
  let resp = JSON.parse(response);

  function fill(item, index, arr){
    var lombardia = "Lombardia";
    if(lombardia.localeCompare(item.denominazione_regione) == 0)
      $('#SelectRegione').append('<option selected value="' + item.denominazione_regione + '">' + item.denominazione_regione + '</option>');
    else
      $('#SelectRegione').append('<option value="' + item.denominazione_regione + '">' + item.denominazione_regione + '</option>');
  }

  resp.forEach(fill)
  callRegione(RegioniCallObj, displayRegione, "Lombardia");
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

  function parseDatass(item, index, arr){
    casi.push(item.nuovi_positivi);
    dates.push(item.data);
    decessi.push(item.deceduti);
    terapia.push(item.terapia_intensiva);
    tamponi.push(item.tamponi);
    totalePositivi.push(item.totale_positivi);
  }

  resp.forEach(parseDatass);

  document.getElementById("ultimoAggiornamento").innerHTML = "Ultimo aggiornamento <br>" + dates[dates.length - 1];

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
  var chart = new Chart(ctx, {
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

/*  new Chart(document.getElementById("positiviDecessi"), {
    type: 'pie',
    data: {
      labels: ["Positivi", "Decessi"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["green", "red"],
        data: [positiviOggi, decessiOggi]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Positivi e Decessi'
      }
    }
  });*/

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

function displayRegione(response, regione){
  let resp = JSON.parse(response);
  var casi = new Array();
  var dates = new Array();
  var positivi = new Array();
  var decessi = new Array();
  var terapia = new Array();
  var tamponi = new Array();
  var totalePositivi = new Array();

  function parseDatass(item, index, arr){
    if(regione.localeCompare(item.denominazione_regione) == 0){
      casi.push(item.nuovi_positivi);
      dates.push(item.data);
      decessi.push(item.deceduti);
      terapia.push(item.terapia_intensiva);
      tamponi.push(item.tamponi);
      totalePositivi.push(item.totale_positivi);
    }
  }

  resp.forEach(parseDatass);

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
  var chart = new Chart(ctx, {
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
}

function callProvincia(call, callback, provincia){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        callback(xhr.response, provincia);
      }
    }
  }

  xhr.open(call.method, call.url, call.asynchronous);
  xhr.send();
}

function displayProvincia(response, provincia){
  let resp = JSON.parse(response);
  var casi = new Array();
  var dates = new Array();
  var positivi = new Array();

  function parseDatass(item, index, arr){
    if(provincia.localeCompare(item.sigla_provincia) == 0){
      casi.push(item.totale_casi);
      dates.push(item.data);
    }
  }

  resp.forEach(parseDatass);
  positivi.push(casi[0]);
  for(var i = 1; i < casi.length; i++){
    positivi.push(casi[i] - casi[i - 1]);
  }

  console.log(casi[casi.length - 1]);

  var casiOggi = casi[casi.length - 1] - casi[casi.length - 2];

  var ctx = document.getElementById('AndamentoGeneraleProvincia').getContext('2d');
  var chart = new Chart(ctx, {
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

/*  new Chart(document.getElementById("positiviDecessi"), {
    type: 'pie',
    data: {
      labels: ["Positivi", "Decessi"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["green", "red"],
        data: [positiviOggi, decessiOggi]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Positivi e Decessi'
      }
    }
  });*/

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
    colors:              ["lightgreen", "#ec716f"],
    duration:            400,
    wrpClass:            'circles-wrp',
    textClass:           'circles-text',
    valueStrokeClass:    'circles-valueStroke',
    maxValueStrokeClass: 'circles-maxValueStroke',
    styleWrapper:        true,
    styleText:           true
  });
}
