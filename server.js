// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var exec = require('child_process').exec;
var nodestatic = require('node-static');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data.db');
var staticServer = new nodestatic.Server("html"); // Setup static server for "html" directory
var child;
var moehre = 0;
var temparray = {};
tempid = ["t1","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2","t2"];
data2 = {temperature_record:[0,0,0,0,0,0,0,0]};

// Datei einlesen für Device config
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
	tempid = data;															     	//reihenfolge der scripte wird hier umgestellt
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
var device = "python scripts/./"+[tempid]+".py";
child = exec(device, function (error, stdout, stderr) {
	var temp = {};
	temp[tempid] = stdout;
	temp[tempid] = Math.round(temp[tempid] * 10) / 10;
	callback(temp[tempid]);
	if (moehre <= 14) {moehre++}
	else {moehre = 0};
	loopi();
	});
};

// Ruft readTemp auf.
function loopi(){
readTemp(tempid[moehre], function(temp){
	temparray[tempid] = temp;
	var key = temparray[tempid]
	data2.temperature_record[moehre]=key;
	}
);	
}

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
function database() {
db.serialize(function() {
  db.run("CREATE TABLE data (info TEXT)");

  var stmt = db.prepare("INSERT INTO data VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("set" + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM data", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();
}

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
			if(err) {console.log(err);} else {console.log("The file was saved!");}
			}); 
		response.writeHead(200, { "Content-type": "application/json" });		
	    response.end();
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
			if(err) {console.log(err);} else {console.log("The file was saved!");}
			}); 
		response.writeHead(200, { "Content-type": "application/json" });		
	    response.end();
		return;
		}		
		
	// damit bei aufruf der seite direkt die richtigen werte ausgegeben werden, fülle
	// ich das "ausgabe array" mit daten aus der datein devices.txt
	// implementierung fehlt noch
    /*if (pathfile== '/multi.htm'){
			readDatei("devices.txt", function(data){console.log("passiert");});
		}
	*/
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
server.listen(8000);
console.log('Server running at :8000');
loopi();