// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var exec = require('child_process').exec;
var nodestatic = require('node-static');
var staticServer = new nodestatic.Server("html"); // Setup static server for "html" directory
var child;
var moehre = 0;
var temparray = {};
var array = fs.readFileSync('devices.txt').toString().split("\n");
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
     var data = buffer.toString('ascii').split("\n"); // Split by space
	 tempid = data;
	 console.log(tempid);
      // Device Daten in data verpacken
   	var data = {
            devices:[{
            list: data
            }]};

      // Execute call back with data
      callback(data);
   });
};

function devices(daten){
datenr = daten.dev0+"\n"+daten.dev1+"\n"+
		 daten.dev2+"\n"+daten.dev3+"\n"+
		 daten.dev4+"\n"+daten.dev5+"\n"+
		 daten.dev6+"\n"+daten.dev7+"\n"+
		 daten.dev8+"\n"+daten.dev9+"\n"+
		 daten.dev10+"\n"+daten.dev11+"\n"+
		 daten.dev12+"\n"+daten.dev13+"\n"+
		 daten.dev14+"\n"+daten.dev15;
console.log("Get ausgeführt");
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

// Setup node http server
var i = 0;
var server = http.createServer(
	// Our main server function
	function(request, response)
	{
		// Grab the URL requested by the client and parse any query options
		var url = require('url').parse(request.url, true);
		var pathfile = url.pathname;
		var query = url.query;
		var url_parts = url.parse(request.url, true);
		var daten = url_parts.query;
		var subpath = pathfile.substr(1, 5);
		var deviceid = pathfile.substr(6).replace(".json","");
		
      // Test to see if it's a request for current temperature   
      if (request.url == '/tnow.json'){
			response.writeHead(200, { "Content-type": "application/json" });		
			response.end(JSON.stringify(data2), "ascii");
			//i ++;
			//console.log('Senden:', i, data2.temperature_record[0]);
      return;
      }

      if (pathfile== '/check.json'){
            readDatei("devices.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
				  console.log('Laden');
               });
      return;
      }		

      if (pathfile== '/discover.json'){
            readDatei("discover.txt",function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
				  console.log('Discover');
               });
      return;
      }		  
	  
      if (pathfile== '/get.htm'){
		console.log('Device 1:', daten);
		fs.writeFile("devices.txt", devices(daten), function(err) {
			if(err) {console.log(err);} else {console.log("The file was saved!");}
			}); 
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
			// Print requested file to terminal
			//console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);
			i = 0;
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
// Log message
console.log('Server running at :8000');
loopi();