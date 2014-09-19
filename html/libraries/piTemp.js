var moehre = 0;														// zaehler var. läuft von 1-8 und stellt geräte ID bzw graph ID dar
var timevar = 10;														// verzögerung in MS mit der ausgeben() ausgefuehrt wird. -> wenn zu schnell kann ausgabe ruckeln
var graph = {};															// array mit graphen
var schalter = 1;														// on / off für Status
var focusvar = 1;													// browserfenster im focus ja/nein
var limitmax = {};
var limitmin = {};
var limitwar = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var cords = [40,190, 2];											// skala 0 punkte, 190 - 166 ist obere grenze für höhe -> 24, Höhe / Max Skala * Grenze  //- cords[1] / graph[moehre].max * limit ,

var tmax = 120;														// max wert für graph temp
var qmax = 40; 														// max wert für graph durchfluss
var limitcolor = "grey";											// farbe limit
var strokecolor = "transparent";											// farbe umrandung

function hide() {
$( "#debug" ).toggle();
}

function logger(data) {
	if ( $('#logbox').attr('checked')  ) {
		console.log(data);
		}
 }

function turbo() {
logger("click");
	if ( $('#turbo').attr('checked')  ) {
		timevar = 10;
		logger("fast");
		}
	else {timevar = 1500; logger("slow");}
 }
 
// ist zahl ungerade?
function isOdd(num) { return num % 2;}

// browserfenster im focus 1 sonst 0
window.onblur= function() {
focusvar=0;
$('#status').text("halt");
logger("loosing focus");
}

window.onfocus= function() {
focusvar=1;
grenze();
logger("in focus");
}

// daten von server besorgen
function getData(){	
var data;
var jsonurl = './tnow.json';
$.ajax({
	type: "GET",
	url: jsonurl,																// Daten-Stream url
	data: data,																// Variable für json Container
	async: true,						
	dataType: "json",
	success: function(data){										// nur ausführen wenn getJson (hier ajax) erfolgreich war sonst zu error:	
	logger('get ./tnow.json');
	celsius = data.temperature_record;
	grenze();
	},
	//error: function(){alert('Der Server antwortet nicht!'); schalter = "error";}
	});	
}	

function farbe() {
limitcolor = $('#farbe').val(); 
logger("HIER");
getLimits();  
}

function getLimits(){	
var data;
var jsonurl = './limitsnow.json';
$.ajax({
	type: "GET",
	url: jsonurl,																	// Daten-Stream url
	data: data,																	// Variable für json Container
	async: true,						
	dataType: "json",
	success: function(data){											// nur ausführen wenn getJson (hier ajax) erfolgreich war sonst zu error:
	logger('get ./limitsnow.json');		
	var ii = 16;
	var iii=0;
	for (var key in data) {
		var obj = data[key]
		if (obj.max > tmax) {
			obj.max = tmax;
			}
		if (obj.max == '' | obj.min == '') {
			logger("Keine Grenzen geschickt!");
			}
		else {
			if (isOdd(ii) == false) {
				graph[ii] = new RGraph.Drawing.Rect({id: 'g'+iii, x: cords[0] , 	y: cords[1] - 166 / graph[0].max * obj.max, width: 38, height: 2, options:{strokestyle: strokecolor, fillstyle:limitcolor}}).draw();
				graph[ii+1] = new RGraph.Drawing.Rect({id: 'g'+iii, x: cords[0] , 	y: cords[1] - 166 / graph[0].max * obj.min, width: 38, height: 2, options:{strokestyle: strokecolor, fillstyle:limitcolor}}).draw();
				}
			else {
				graph[ii] = new RGraph.Drawing.Rect({id: 'g'+iii, x: cords[2] , 	y: cords[1] - 166 / graph[1].max * obj.max, width: 38, height: 2, options:{strokestyle: strokecolor, fillstyle:limitcolor}}).draw();
				graph[ii+1] = new RGraph.Drawing.Rect({id: 'g'+iii, x: cords[2] , 	y: cords[1] - 166 / graph[1].max * obj.min, width: 38, height: 2, options:{strokestyle: strokecolor, fillstyle:limitcolor}}).draw();					
				}		
			ii++;
			iii++;
			limitmax[ii-16] = obj.max;
			limitmin[ii-16] = obj.min;
			}
		}
	},
	error: function(){alert('Der Server antwortet nicht!'); schalter = "error";}
	});	
}	

function grenze ()  {
if (limitmax[moehre+1]  == '' | limitmin[moehre+1]=='') {
logger("Keine Grenzen");
}
else if (celsius[moehre] > limitmax[moehre+1] && limitwar[moehre]==0) { 
			// graph[moehre].set('colors', ['#FF0000']);
			$('#data'+moehre).css( "color", "red" );
			$('#dataC'+moehre).css( "color", "red" );
			limitwar[moehre] = 1;
			}
else if (celsius[moehre] < limitmin[moehre+1] && limitwar[moehre]==0) {
			// graph[moehre].set('colors', ['#FF0000']);
			$('#data'+moehre).css( "color", "red" );
			$('#dataC'+moehre).css( "color", "red" );
			limitwar[moehre] = 1;
			}
else if (( (celsius[moehre] < limitmax[moehre+1]) && ((celsius[moehre] > limitmin[moehre+1])  )  && limitwar[moehre]==1)) {
		 limitwar[moehre]=0;
		if (moehre & 1) {
				// graph[moehre].set('colors', ['#3C7DC4']);
				$('#data'+moehre).css( "color", "" );
				$('#dataC'+moehre).css( "color", "" );
			}
		else {
				// graph[moehre].set('colors', ['#5A8F29']);
				$('#data'+moehre).css( "color", "" );
				$('#dataC'+moehre).css( "color", "" );
			}
		}
// RGraph.redraw();
ausgeben();
}

// ausgabe von graph und daten, rekursiv 
function ausgeben () {
if (schalter == "on" && focusvar ==1) {						// abhaengig ob fenster im focus ist und "on"
	$('#status').text("on");												// nicht sehr performant, wird jedes mal neu gezeichnet
	if (moehre == 16) {													// wenn 8 mal daten ausgegeben worden sind -> neue daten aus getData() holen
		moehre = 0;
		getData();
		}
	else {
			graph[moehre].value = celsius[moehre];   	// graph[aktueller zählervar wert] mit den daten aus dem celsius array fuellen			
			$('#data'+moehre).text(celsius[moehre]); 		// text feld (span tag) mit wert fuellen
			graph[moehre].grow();										// graph aktualisieren mit grow animation
			moehre++;															// zählervar auf naechste graph[id] setzen
			logger("zeichnen!");
			setTimeout(grenze, timevar);							// verzoegern um graph zeit für grow tz geben
	}
}
else if (schalter == "off") {												// ausgabe stoppen
	logger('off')
	$('#status').text("off");
	moehre = 0;
	}
else if (schalter == "error") {
	logger('error')
	$('#status').text("ERROR");
	moehre = 0;	
	}
}
// user eingabe nutzen um ausgabe zu steuern
function choose(choice){							
schalter = choice;
getData();
}

function scale() {
RGraph.Reset(g0);
var mint=$('#mint').val(); 
var maxt=$('#maxt').val();
graph[0]  = new RGraph.VProgress({id: 'g0',  min: Number(mint), max: Number(maxt), value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
}

// graphen beim Seitenaufbau einmalig zeichnen
// ID von Canvas, min, max, value 0 -> startwert, gutter abstand von graph zu canvas (?), labels seite und wieviele, farbe -> draw!
function initGraph (json) {
graph[0]  = new RGraph.VProgress({id: 'g0',  min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[1]  = new RGraph.VProgress({id: 'g1',  min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[2]  = new RGraph.VProgress({id: 'g2',  min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[3]  = new RGraph.VProgress({id: 'g3',  min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[4]  = new RGraph.VProgress({id: 'g4',  min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[5]  = new RGraph.VProgress({id: 'g5',  min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[6]  = new RGraph.VProgress({id: 'g6',  min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[7]  = new RGraph.VProgress({id: 'g7',  min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[8]  = new RGraph.VProgress({id: 'g8',  min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[9]  = new RGraph.VProgress({id: 'g9',  min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[10] = new RGraph.VProgress({id: 'g10', min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[11] = new RGraph.VProgress({id: 'g11', min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[12] = new RGraph.VProgress({id: 'g12', min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[13] = new RGraph.VProgress({id: 'g13', min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[14] = new RGraph.VProgress({id: 'g14', min: 0, max: tmax, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[15] = new RGraph.VProgress({id: 'g15', min: 0, max: qmax,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
}