var express = require('express');
var app=express();
var bodyparser=require('body-parser');
//var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
var mongoose=require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json())

//Connect to Mongoose db
mongoose.connect('mongodb://Localhost/calendar' , { useMongoClient: true });
var db =mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var api = require('./routes/api');
app.use('/api/', api);
//app.get('/',function(req,res){
	//res.send('Hello World');
//});
//app.use('/img',express.static(__dirname, "public/images"));
app.use('/content',express.static(__dirname + "/public/content"));
app.use('/scripts',express.static(__dirname + "/public/scripts"));
app.use(express.static(__dirname + "/views/calendar/"));

app.listen(3000);
console.log('Running on port 3000......')