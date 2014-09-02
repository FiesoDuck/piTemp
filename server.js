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
tempid = ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13","t14","t15","t16"];
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

	if (pathfile== '/config1.json'){
            readDatei("devices.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
    return;
    }		
	  
      if (pathfile== '/get.json'){
		fs.writeFile("devices.txt", devices(daten), function(err) {
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