var moehre = 0;						// zaehler var. läuft von 1-8 und stellt geräte ID bzw graph ID dar
var timevar = 1000;					// verzögerung in MS mit der ausgeben() ausgefuehrt wird. -> wenn zu schnell kann ausgabe ruckeln
var graph = {};						// array mit graphen
var schalter = 0;					// on / off für Status
var focusvar = 1;					// browserfenster im focus ja/nein
var limit = 0;

// browserfenster im focus 1 sonst 0
window.onblur= function() {
focusvar=0;
$('#status').text("halt");
}

window.onfocus= function() {
focusvar=1;
ausgeben ();
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
	error: function(){alert('Der Server antwortet nicht!'); schalter = "error";}
	});	
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
		console.log(celsius[moehre], limit);				
		if (limit != 0 && celsius[moehre] >= limit) { 		// Limit warnung
		alert("Limit ueberschritten \n" + "Soll: " + limit + "\nIst: " +celsius[moehre]);
		$('#thi'+moehre).css("background-color","red");
		schalter="off";
		};
		$('#data'+moehre).text(celsius[moehre]); 		// text feld (span tag) mit wert fuellen
		graph[moehre].grow();										// graph aktualisieren mit grow animation
		moehre++;															// zählervar auf naechste graph[id] setzen
		setTimeout(ausgeben, timevar);					// verzoegern um graph zeit für grow tz geben
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
ausgeben();
}
function scale() {
RGraph.Reset(g0);
var mint=document.getElementById('mint').value; 
var maxt=document.getElementById('maxt').value;
graph[0]  = new RGraph.VProgress({id: 'g0',  min: Number(mint), max: Number(maxt), value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();

}

function limits() {
var teste = document.getElementById('limitt').type;
limit = document.getElementById('limitt').value; 
if (limit == "") {alert("Bitte Zahl eingeben!")}
else {console.log(limit); $('#limit').text(limit)}
}
// graphen beim Seitenaufbau einmalig zeichnen
// ID von Canvas, min, max, value 0 -> startwert, gutter abstand von graph zu canvas (?), labels seite und wieviele, farbe -> draw!
function initGraph (json) {
graph[0]  = new RGraph.VProgress({id: 'g0',  min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[1]  = new RGraph.VProgress({id: 'g1',  min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[2]  = new RGraph.VProgress({id: 'g2',  min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[3]  = new RGraph.VProgress({id: 'g3',  min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[4]  = new RGraph.VProgress({id: 'g4',  min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[5]  = new RGraph.VProgress({id: 'g5',  min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[6]  = new RGraph.VProgress({id: 'g6',  min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[7]  = new RGraph.VProgress({id: 'g7',  min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[8]  = new RGraph.VProgress({id: 'g8',  min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[9]  = new RGraph.VProgress({id: 'g9',  min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[10] = new RGraph.VProgress({id: 'g10', min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[11] = new RGraph.VProgress({id: 'g11', min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[12] = new RGraph.VProgress({id: 'g12', min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[13] = new RGraph.VProgress({id: 'g13', min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
graph[14] = new RGraph.VProgress({id: 'g14', min: 0, max: 120, value: 0, options: {scale: {decimals: 1}, gutter: {right: 2, left:  40, bottom: 10}, labels: {position: "left" , count: 5}, colors:['#5A8F29']}}).draw();
graph[15] = new RGraph.VProgress({id: 'g15', min: 0, max: 40,  value: 0, options: {scale: {decimals: 1}, gutter: {left:  2, right: 40, bottom: 10}, labels: {position: "right", count: 5}, colors:['#3C7DC4']}}).draw();
}