var moehre = 0;														// zaehler var. läuft von 1-8 und stellt geräte ID bzw graph ID dar
var timevar = 1000;												// verzögerung in MS mit der ausgeben() ausgefuehrt wird. -> wenn zu schnell kann ausgabe ruckeln
var graph = {};															// array mit graphen
var schalter = 0;														// on / off für Status
var focusvar = 1;													// browserfenster im focus ja/nein
var limit = 0;
var limitwar = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var cords = [40,190, 2];											// skala 0 punkte, 190 - 166 ist obere grenze für höhe -> 24, Höhe / Max Skala * Grenze  //- cords[1] / graph[moehre].max * limit ,
var tmax = 120;														// max wert für graph temp
var qmax = 40; 														// max wert für graph durchfluss
var limitcolor = "red";												// farbe limit

// browserfenster im focus 1 sonst 0
window.onblur= function() {
focusvar=0;
$('#status').text("halt");
}

window.onfocus= function() {
focusvar=1;
grenze();
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
	console.log("get ./tnow.json");		
	celsius = data.temperature_record;
	grenze();
	},
	error: function(){alert('Der Server antwortet nicht!'); schalter = "error";}
	});	
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
	console.log("get ./limitsnow.json");		
	for (var key in data) {
		var obj = data[key]
		console.log(obj.max);
		if (obj.max > tmax) {
			key.obj.max = tmax;
			}
		}
		
	graph[16] = new RGraph.Drawing.Rect({id: 'g0', x: cords[0] , 	y: cords[1] - 166 / graph[0].max * data.dev0.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[17] = new RGraph.Drawing.Rect({id: 'g0', x: cords[0] , 	y: cords[1] - 166 / graph[0].max * data.dev0.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[18] = new RGraph.Drawing.Rect({id: 'g1', x: cords[2] , 	y: cords[1] - 166 / graph[1].max * data.dev1.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[19] = new RGraph.Drawing.Rect({id: 'g1', x: cords[2] , 	y: cords[1] - 166 / graph[1].max * data.dev1.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[20] = new RGraph.Drawing.Rect({id: 'g2', x: cords[0] , 	y: cords[1] - 166 / graph[2].max * data.dev2.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[21] = new RGraph.Drawing.Rect({id: 'g2', x: cords[0] , 	y: cords[1] - 166 / graph[2].max * data.dev2.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[22] = new RGraph.Drawing.Rect({id: 'g3', x: cords[2] , 	y: cords[1] - 166 / graph[3].max * data.dev3.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[23] = new RGraph.Drawing.Rect({id: 'g3', x: cords[2] , 	y: cords[1] - 166 / graph[3].max * data.dev3.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[24] = new RGraph.Drawing.Rect({id: 'g4', x: cords[0] , 	y: cords[1] - 166 / graph[4].max * data.dev4.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[25] = new RGraph.Drawing.Rect({id: 'g4', x: cords[0] , 	y: cords[1] - 166 / graph[4].max * data.dev4.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[26] = new RGraph.Drawing.Rect({id: 'g5', x: cords[2] , 	y: cords[1] - 166 / graph[5].max * data.dev5.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[27] = new RGraph.Drawing.Rect({id: 'g5', x: cords[2] , 	y: cords[1] - 166 / graph[5].max * data.dev5.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[28] = new RGraph.Drawing.Rect({id: 'g6', x: cords[0] , 	y: cords[1] - 166 / graph[6].max * data.dev6.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[29] = new RGraph.Drawing.Rect({id: 'g6', x: cords[0] , 	y: cords[1] - 166 / graph[6].max * data.dev6.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[30] = new RGraph.Drawing.Rect({id: 'g7', x: cords[2] , 	y: cords[1] - 166 / graph[7].max * data.dev7.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[31] = new RGraph.Drawing.Rect({id: 'g7', x: cords[2] , 	y: cords[1] - 166 / graph[7].max * data.dev7.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[32] = new RGraph.Drawing.Rect({id: 'g8', x: cords[0] , 	y: cords[1] - 166 / graph[8].max * data.dev8.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[33] = new RGraph.Drawing.Rect({id: 'g8', x: cords[0] , 	y: cords[1] - 166 / graph[8].max * data.dev8.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();
	graph[34] = new RGraph.Drawing.Rect({id: 'g9', x: cords[2] , 	y: cords[1] - 166 / graph[9].max * data.dev9.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[35] = new RGraph.Drawing.Rect({id: 'g9', x: cords[2] , 	y: cords[1] - 166 / graph[9].max * data.dev9.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[36] = new RGraph.Drawing.Rect({id: 'g10', x: cords[0] , 	y: cords[1] - 166 / graph[10].max * data.dev10.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[37] = new RGraph.Drawing.Rect({id: 'g10', x: cords[0] , 	y: cords[1] - 166 / graph[10].max * data.dev10.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[38] = new RGraph.Drawing.Rect({id: 'g11', x: cords[2] , 	y: cords[1] - 166 / graph[11].max * data.dev11.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[39] = new RGraph.Drawing.Rect({id: 'g11', x: cords[2] , 	y: cords[1] - 166 / graph[11].max * data.dev11.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[40] = new RGraph.Drawing.Rect({id: 'g12', x: cords[0] , 	y: cords[1] - 166 / graph[12].max * data.dev12.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[41] = new RGraph.Drawing.Rect({id: 'g12', x: cords[0] , 	y: cords[1] - 166 / graph[12].max * data.dev12.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[42] = new RGraph.Drawing.Rect({id: 'g13', x: cords[2] , 	y: cords[1] - 166 / graph[13].max * data.dev13.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[43] = new RGraph.Drawing.Rect({id: 'g13', x: cords[2] , 	y: cords[1] - 166 / graph[13].max * data.dev13.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();		
	graph[44] = new RGraph.Drawing.Rect({id: 'g14', x: cords[0] , 	y: cords[1] - 166 / graph[14].max * data.dev14.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[45] = new RGraph.Drawing.Rect({id: 'g14', x: cords[0] , 	y: cords[1] - 166 / graph[14].max * data.dev14.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[46] = new RGraph.Drawing.Rect({id: 'g15', x: cords[2] , 	y: cords[1] - 166 / graph[15].max * data.dev15.max, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();	
	graph[47] = new RGraph.Drawing.Rect({id: 'g15', x: cords[2] , 	y: cords[1] - 166 / graph[15].max * data.dev15.min, width: 38, height: 2, options:{fillstyle:limitcolor}}).draw();			
	},
	error: function(){alert('Der Server antwortet nicht!'); schalter = "error";}
	});	
}	

function grenze ()  {
if (limit != 0 && celsius[moehre] > limit && limitwar[moehre]==0) { 
			graph[moehre].set('colors', ['#FF0000']);
			limitwar[moehre] = 1;
			}
else if (limit!=0 &&  celsius[moehre] < limit  && limitwar[moehre]==1) {
		 limitwar[moehre]=0;
		if (moehre & 1) {
				graph[moehre].set('colors', ['#3C7DC4']);
			}
		else {
				graph[moehre].set('colors', ['#5A8F29']);
			}
		}
RGraph.redraw();
ausgeben();
}

// ausgabe von graph und daten, rekursiv 
function ausgeben () {
if (schalter == "on" && focusvar ==1) {				// abhaengig ob fenster im focus ist und "on"
	$('#status').text("on");
	if (moehre == 16) {											// wenn 8 mal daten ausgegeben worden sind -> neue daten aus getData() holen
		moehre = 0;
		getData();
		}
	else {
			graph[moehre].value = celsius[moehre];   	// graph[aktueller zählervar wert] mit den daten aus dem celsius array fuellen			
			$('#data'+moehre).text(celsius[moehre]); 		// text feld (span tag) mit wert fuellen
			graph[moehre].grow();										// graph aktualisieren mit grow animation
			moehre++;															// zählervar auf naechste graph[id] setzen
			setTimeout(grenze, timevar);					// verzoegern um graph zeit für grow tz geben
	}
}
else if (schalter == "off") {											// ausgabe stoppen
	$('#status').text("off");
	moehre = 0;
	}
else if (schalter == "error") {
	$('#status').text("ERROR");
	moehre = 0;	
	}
}
// user eingabe nutzen um ausgabe zu steuern
function choose(choice){							
schalter = choice;
getData();
}

function tester() {
RGraph.ObjectRegistry.Remove(graph[16]);
graph[16] = new RGraph.Drawing.Rect({id: 'g0', x: cords[0] , 	y: cords[1] -100 , width: 38, height: 30});
RGraph.redraw();
}

function scale() {
RGraph.Reset(g0);
var mint=$('#mint').val(); 
var maxt=$('#maxt').val();
graph[0]  = new RGraph.VProgress({id: 'g0',  min: Number(mint), max: Number(maxt), value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
}

function setlimits() {
RGraph.ObjectRegistry.Remove(graph[16]);
var teste = $('#limitt').type;
limit = parseInt($('#limitt').val()); 
console.log(typeof(limit));
if (limit == 0) {
graph[16] = new RGraph.Drawing.Rect({id: 'g0', x: cords[0] , 	y: cords[1]  - 166 / graph[moehre].max * limit, width: 38, height: 0});
}
else {graph[16] = new RGraph.Drawing.Rect({id: 'g0', x: cords[0] , 	y: cords[1]  - 166 / graph[moehre].max * limit, width: 38, height: 2});}

RGraph.redraw();
$('#limit').text(limit);

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