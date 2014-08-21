// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var exec = require('child_process').exec;
var child;

// Use node-static module to server chart for client-side dynamic graph
var nodestatic = require('node-static');

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");
var moehre = 1;
var fs = require('fs');
var array = fs.readFileSync('devices.txt').toString().split("\n");
console.log(array[0]);

// Verfügbare Devices in Datei schreiben
function writeDatei()
{
	child = exec("ls -m -1 /sys/bus/w1/devices > devices.txt", function (error, stdout, stderr) {
	  console.log('stdout: ' + stdout);
	  console.log('stderr: ' + stderr);
	  if (error !== null) {
		console.log('exec error: ' + error);
	  }
	  else {console.log('Daten geschrieben!')};
	});
}

// Datei einlesen für Device config
function readDatei(txtfile, callback){
	fs.readFile(txtfile, function(err, buffer)
	{
      if (err){
		 console.log('Datei nicht vorhanden!');
		 console.log('Versuche Datei zu erzeugen. Bitte Sever neu starten!');
		 writeDatei();
         console.error(err);
         process.exit(1);
      }

      // Read data from file (using fast node ASCII encoding).
     var data = buffer.toString('ascii').split("\n"); // Split by space
	 
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
		 daten.dev6+"\n"+daten.dev7;
console.log("Get ausgeführt");
return datenr;
}



// Read current temperature from sensor
function readTemp(callback){

child = exec("python ./temp.py", function (error, stdout, stderr) {
	  console.log('stdout: ' + stdout);
	  var temp = stdout;
// Round to one decimal place
temp = Math.round(temp * 10) / 10;
console.log(temp);
// Add date/time to temperature
   	var data = {
            temperature_record:[{
            unix_time: Date.now(),
            celsius: temp
            }]};

      // Execute call back with data
      callback(data);
	 	});
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
		var url_parts = url.parse(request.url, true);
		var daten = url_parts.query;
		var query = url.query;
		var subpath = pathfile.substr(1, 5);
		var deviceid = pathfile.substr(6).replace(".json","");
		console.log('Path: ', subpath);
		console.log('Device ID: ', deviceid);
		
      // Test to see if it's a request for current temperature   
      if (subpath == 'tnow_'){
            readTemp(function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
				  i ++;
				  console.log('Geschrieben!', i);
               });
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
		if (pathfile == '/favicon.ico'){
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end();

			// Optionally log favicon requests.
			//console.log('favicon requested');
			return;
		}

		else {
			// Print requested file to terminal
			console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);
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
