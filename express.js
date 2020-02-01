var cluster = require('cluster');
var http = require('http'), fs = require('fs');

//Heroku postgres crednetials 

// const connection = mysql2.createConnection({
//     host:'ec2-3-210-157-123.compute-1.amazonaws.com',
//     database:'desvnetaeegn3c',
//     port:5432,
//     user:'huefwoizucxopu',
//     password:'    cf76f98b1fd810d90aa8d490e006e43e01f5bd2220ce056120f2c2ed0a961e6e',
//     database:'final'
// });


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.postgres://huefwoizucxopu:cf76f98b1fd810d90aa8d490e006e43e01f5bd2220ce056120f2c2ed0a961e6e@ec2-3-210-157-123.compute-1.amazonaws.com:5432/desvnetaeegn3c,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});



if(cluster.isMaster) {
	var numWorkers = require('os').cpus().length;

	console.log('Master cluster setting up ' + numWorkers + ' workers...');
var count = 0 ;
	for(var i = 0; i < numWorkers; i++) {
		cluster.fork();
		if(count == 0){
			//this is a picture file 


			fs.readFile('picture.png', function(err, data) {
  if (err) throw err; // Fail if the file can't be read.

  //convertin the image to base64

  const image2base64 = require('image-to-base64');
image2base64("picture.png") // you can also to use url
    .then(
        (response) => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )


  http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); // Send the file data to the browser.
  }).listen(3000);
  console.log('Server running at http://localhost:8124/');
});
		}

		if(count == 1)
		{
			//this is an audio file


		}



count++;
	}

	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	cluster.on('exit', function(worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
		console.log('Starting a new worker');
		cluster.fork();
	});
} else {
	var app = require('express')();
	app.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})

	var server = app.listen(8000, function() {
		console.log('Process ' + process.pid + ' is listening to all incoming requests');
	});
}