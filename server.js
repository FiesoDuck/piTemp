// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var util = require('util');
var exec = require('child_process').exec;
var nodestatic = require('node-static');
var sqlite3 = require('sqlite3').verbose();
//Webserver
var staticServer = new nodestatic.Server("html"); // Setup static server for "html" directory
var child;
var moehre = 0;
var toggle = 0;
var sinmoehre = 10;
var temparray = {};
var tempid = ["t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2"];
var data2 = {temperature_record:[0,0,0,0,0,0,0,0]};

// Database
var dbfile= "data.db";
var db = new sqlite3.Database(dbfile);
var exists = fs.existsSync(dbfile);

//Barcode reader
var readline = require('readline');
var check = 0;

// ist zahl ungerade?
function isOdd(num) { return num % 2;}

// Prüfen ob DB-Datei existiert, sonst Datei erzeugen
if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(dbfile, "w");
}

// Devices aus Datei lesen und senden
function initRead(txtfile){
	fs.readFile(txtfile, function(err, buffer)		{
			if (err) {
				console.log('Datei nicht vorhanden!');
				 console.error(err);
				process.exit(1);
				}
	// Read data from file (using fast node ASCII encoding).
	var data = buffer.toString('ascii').split("\n"); 					// trennen nach zeilenumbruch
	tempid = data;															     	//reihenfolge der scripte wird hier umgestellt
	var data = {devices:[{list: data}]};
	});
	loopi();
};

// Datei einlesen und daten senden
function readDatei(txtfile, callback){
	fs.readFile(txtfile, function(err, buffer)
		{
			if (err){
			console.log('Datei nicht vorhanden!');
			 console.error(err);
			process.exit(1);
			}
	// Read data from file (using fast node ASCII encoding).
	var data = buffer.toString('ascii').split("\n"); 					// trennen nach zeilenumbruch
	var data = {devices:[{list: data}]};
	 // Execute call back with data
	callback(data);
	});
};

//daten in form bringen, inhalt von daten rekursiv an datenr anhängen. endet mit einer leerzeile
function devices(daten){
	var datenr = '';
	for (var name in daten) {datenr +=  daten[name]+"\n"}
	return datenr;
}

// Temperatur auslesen. device steht für das script, welches den richtigen sensor abfragt.
// da dies asynchron passiert wird callback benoetigt, bei callback wird die temp
// zurück an die stelle des aufrufs geschickt
function readTemp(tempid, callback){
if (tempid == "sin") {																// Alles mit SIN ist nur für Fake-Zahlen in sinus form
	//console.log(sinmoehre);
	var temp = {};
	temp[tempid] = Math.round(Math.sin(sinmoehre)  * 10 +  20) ;
	if (toggle == 0) {sinmoehre -= 0.5};
	if (toggle == 1) {sinmoehre += 0.5};
	if (sinmoehre >= 10) {toggle = 0}
	else if (sinmoehre <= -10) {toggle = 1};
	
	database(moehre, temp[tempid]);	
	callback(temp[tempid]);
	
	if (moehre <= 14) {moehre++}
	else {moehre = 0};
	loopi();
}
else {
var device = "python scripts/./"+[tempid]+".py";
child = exec(device, function (error, stdout, stderr) {
	var temp = {};
	temp[tempid] = stdout;
	temp[tempid] = Math.round(temp[tempid] * 10) / 10;
	database(moehre, temp[tempid]);	
	callback(temp[tempid]);
	if (moehre <= 14) {moehre++}
	else {moehre = 0};
	loopi();
	});
}
};

function readBar(test, callback) {
	var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
	});
	rl.prompt();
	rl.question("Bitte Seriennummer scannen: ", function(answer) {
	console.log("Die Nummer lautet:", answer);
	rl.close();
	callback(answer);
	});
}

// Ruft readTemp auf.
function loopi(){
readTemp(tempid[moehre], function(temp){
	temparray[tempid] = temp;
	var key = temparray[tempid]
	data2.temperature_record[moehre]=key;
	}
);	
}

// Grenzen auslesen
function readLimits(txtfile, callback){
	fs.readFile(txtfile, function(err, buffer)
		{
			if (err){
			console.log('Datei nicht vorhanden!');
			 console.error(err);
			process.exit(1);
			}
	// Read data from file (using fast node ASCII encoding).
	var data = buffer.toString('ascii').split("\n"); 					// trennen nach zeilenumbruch
	var data = {
		dev0:{min:data[0],max:data[1]},
		dev1:{min:data[2],max:data[3]},
		dev2:{min:data[4],max:data[5]},
		dev3:{min:data[6],max:data[7]},		
		dev4:{min:data[8],max:data[9]},
		dev5:{min:data[10],max:data[11]},		
		dev6:{min:data[12],max:data[13]},
		dev7:{min:data[14],max:data[15]},
		dev8:{min:data[16],max:data[17]},
		dev9:{min:data[18],max:data[19]},
		dev10:{min:data[20],max:data[21]},
		dev11:{min:data[22],max:data[23]},		
		dev12:{min:data[24],max:data[25]},
		dev13:{min:data[26],max:data[27]},		
		dev14:{min:data[28],max:data[29]},
		dev15:{min:data[30],max:data[31]}		
		};
	
	// Execute call back with data
	callback(data);
	});
}

// muss noch implementiert werden
function database(device, data) {
db.serialize(function() {
	if(!exists) {
		db.run("CREATE TABLE temp_records (device TEXT, time BIGINT primary key, temp real)");
		db.run("CREATE TABLE flow_records   (device TEXT, time DATE, flow TEXT)");
		exists=1;
	}
	if (isOdd(device) == false) {
		var stmt = db.prepare("INSERT INTO temp_records (device, time, temp) VALUES (?, ?, ?)");
	}
	
	else {
		var stmt = db.prepare("INSERT INTO flow_records (device, time, flow) VALUES (?, ?, ?)");
	}
	stmt.run({1: device, 2: Date.now(), 3: data});
	// db.each("SELECT * FROM temp_records", function(err, row) {
	// console.log(util.inspect(row, false, null));
	// });
});
}

// Get temperature records from database
function selectTemp(num_records, start_date, callback){
   // - Num records is an SQL filter from latest record back trough time series, 
   // - start_date is the first date in the time-series required, 
   // - callback is the output function
   var current_temp = db.all("SELECT * FROM (SELECT * FROM temp_records WHERE time > (strftime('%s',?)*1000) ORDER BY time DESC LIMIT ?) ORDER BY time;", start_date, num_records,
      function(err, rows){
         if (err){
			   response.writeHead(500, { "Content-type": "text/html" });
			   response.end(err + "\n");
			   console.log('Error serving querying database. ' + err);
			   return;
				      }
         data = {temperature_record:[rows]}
         callback(data);
   });
};

// Setup node http server
var server = http.createServer(
function(request, response)
{
	// Grab the URL requested by the client and parse any query options
	var url = require('url').parse(request.url, true);
	var pathfile = url.pathname;
	var query = url.query;
	var url_parts = url.parse(request.url, true);
	var daten = url_parts.query;
		
	if (request.url == '/tnow.json'){
		response.writeHead(200, { "Content-type": "application/json" });		
		response.end(JSON.stringify(data2), "ascii");
		return;
    }
	
	if (request.url == '/limitsnow.json'){
			//initRead('devices.txt'); 												erstmal auskommentiert, warum war das hier drin??? besser mal im auge behalten
            readLimits("limits.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
	    return;
    }
	
	if (pathfile== '/rdevices.json'){
            readDatei("devices.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
    return;
    }		
	  
      if (pathfile== '/wdevices.json'){
		fs.writeFile("devices.txt", devices(daten), function(err) {
			if(err) {console.log(err);} else {console.log("Devices gespeichert!");}
			}); 
		response.writeHead(200, { "Content-type": "application/json" });		
	    response.end();
		return;
		}

      if (pathfile== '/wbarconf.json'){
		fs.writeFile("bardevices.txt", devices(daten), function(err) {
			if(err) {console.log(err);} else {console.log("Barcodes gespeichert!");}
			}); 
		response.writeHead(200, { "Content-type": "application/json" });		
	    response.end();
		return;
		}		

	if (pathfile== '/rbarconf.json'){
            readDatei("bardevices.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
    return;
    }		
		
	if (pathfile== '/rlimits.json'){
            readDatei("limits.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
    return;
    }		
	  
      if (pathfile== '/wlimits.json'){
		fs.writeFile("limits.txt", devices(daten), function(err) {
			if(err) {console.log(err);} else {console.log("Limits gespeichert!");}
			}); 
		response.writeHead(200, { "Content-type": "application/json" });		
	    response.end();
		return;
		}

	if (pathfile== '/bar.json'){
        readBar("test", function(answer){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(answer), "ascii");
				  console.log("ende");
               });
  return;
    }		
		
		// Test to see if it's a database query
		if (pathfile == '/temperature_query.json'){
         // Test to see if number of observations was specified as url query
         if (query.num_obs){
            var num_obs = parseInt(query.num_obs);
         }
         else{
         // If not specified default to 20. Note use -1 in query string to get all.
            var num_obs = -1;
         }
         if (query.start_date){
            var start_date = query.start_date;
         }
         else{
            var start_date = '1970-01-01T00:00';
         }   
         // Send a message to console log
         console.log('Database query request from '+ request.connection.remoteAddress +' for ' + num_obs + ' records from ' + start_date+'.');
         // call selectTemp function to get data from database
         selectTemp(num_obs, start_date, function(data){
            response.writeHead(200, { "Content-type": "application/json" });		
	         response.end(JSON.stringify(data), "ascii");
         });
      return;
      }

	// Handler for favicon.ico requests
	if (pathfile == '/img/favicon.ico'){
		response.writeHead(200, {'Content-Type': 'image/x-icon'});
		response.end();
		//Optionally log favicon requests.
		console.log('favicon requested');
		return;
	}		
		else {
			// Serve file using node-static			
			staticServer.serve(request, response, function (err, result) {
				if (err){
					// Log the error
					sys.error("Error serving " + request.url + " - " + err.message);	
					// Respond to the client
					response.writeHead(err.status, err.headers);
					response.end('Error 404 - file not found');
					return;
					}
				return;	
				})
		}
});

// Enable server
initRead('devices.txt');
server.listen(8000);
console.log('Server running at :8000');