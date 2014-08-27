var moehre = 0;						// zaehler var. läuft von 1-8 und stellt geräte ID bzw graph ID dar
var timevar = 1000;					// verzögerung in MS mit der ausgeben() ausgefuehrt wird. -> wenn zu schnell kann ausgabe ruckeln
var graph = {};						// array mit graphen
var schalter = 0;					// on / off für Status
var focusvar = 1;					// browserfenster im focus ja/nein

// browserfenster im focus 1 sonst 0
window.onblur= function() {
focusvar=0;
}

window.onfocus= function() {
focusvar=1;
ausgeben ();
}

// graphen beim Seitenaufbau einmalig zeichnen
function initGraph (json) {
graph[0] = new RGraph.VProgress({id: 'g0', min: 0, max: 120, value: 0, options: {gutter: {right: 2, left:  30, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#33CC33']}}).draw();
graph[1] = new RGraph.VProgress({id: 'g1', min: 0, max: 40,  value: 0, options: {gutter: {left:  2, right: 30, bottom: 10}, labels: {position: "right", count: 5}, colors:['#7798BF']}}).draw();
graph[2] = new RGraph.VProgress({id: 'g2', min: 0, max: 120, value: 0, options: {gutter: {right: 2, left:  30, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#33CC33']}}).draw();
graph[3] = new RGraph.VProgress({id: 'g3', min: 0, max: 40,  value: 0, options: {gutter: {left:  2, right: 30, bottom: 10}, labels: {position: "right", count: 5}, colors:['#7798BF']}}).draw();
graph[4] = new RGraph.VProgress({id: 'g4', min: 0, max: 120, value: 0, options: {gutter: {right: 2, left:  30, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#33CC33']}}).draw();
graph[5] = new RGraph.VProgress({id: 'g5', min: 0, max: 40,  value: 0, options: {gutter: {left:  2, right: 30, bottom: 10}, labels: {position: "right", count: 5}, colors:['#7798BF']}}).draw();
graph[6] = new RGraph.VProgress({id: 'g6', min: 0, max: 120, value: 0, options: {gutter: {right: 2, left:  30, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#33CC33']}}).draw();
graph[7] = new RGraph.VProgress({id: 'g7', min: 0, max: 40,  value: 0, options: {gutter: {left:  2, right: 30, bottom: 10}, labels: {position: "right", count: 5}, colors:['#7798BF']}}).draw();
}

// daten von server besorgen
function getData(){	
var data;
var jsonurl = './tnow.json';
$.ajax({
	type: "GET",
	url: jsonurl,						// Daten-Stream url
	data: data,							// Variable für json Container
	async: true,						
	dataType: "json",
	success: function(data){			// nur ausführen wenn getJson (hier ajax) erfolgreich war sonst zu error:
	console.log("get ./tnow.json");		
	celsius = data.temperature_record;
	ausgeben();						   
	},
	error: function(){alert('Der Server antwortet nicht!');}
	});	
}	

// ausgabe von graph und daten, rekursiv 
function ausgeben () {
if (schalter == "on" && focusvar ==1) {			// abhaengig ob fenster im focus ist und "on"
	if (moehre == 8) {							// wenn 8 mal daten ausgegeben worden sind -> neue daten aus getData() holen
		moehre = 0;
		getData();
		}
	else {
		graph[moehre].value = celsius[moehre];   	// graph[aktueller zählervar wert] mit den daten aus dem celsius array fuellen
		$('#data'+moehre).text(celsius[moehre]); 	// text feld (span tag) mit wert fuellen
		graph[moehre].grow();						// graph aktualisieren mit grow animation
		moehre++;									// zählervar auf naechste graph[id] setzen
		setTimeout(ausgeben, timevar);				// verzoegern um graph zeit für grow tz geben
	}
}
else if (schalter == "off") {						// ausgabe stoppen
	moehre = 0;
	}
}

// user eingabe nutzen um ausgabe zu steuern
function choose(choice){							
schalter = choice;
ausgeben();
}