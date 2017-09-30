/****************************************************/
// Filename: app.js
// Created: Moinul Islam<moinul39.iit@gmail.com>
// Change history:
// 26.09.2017 / Moinul Islam<moinul39.iit@gmail.com>
// 28.01.2009 / Moinul Islam<moinul39.iit@gmail.com>
/****************************************************/


var express = require('express');
var app=express();
var bodyparser=require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json())

var mongoose=require('mongoose');
//Connect to Mongoose db
mongoose.connect('mongodb://Localhost/calendar' , { useMongoClient: true });
var db =mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//redirect routes for api call
var api = require('./routes/api');
app.use('/api/', api);


app.use('/content',express.static(__dirname + "/public/content"));
app.use('/scripts',express.static(__dirname + "/public/scripts"));
app.use(express.static(__dirname + "/views/calendar/"));

//app.listen(3000);
var server = app.listen(3000)
var io = require('socket.io').listen(server);


global.io = io; //added socket io globaly
console.log('Running on port 3000......')

/****************************************************/
// EOF: app.js
/****************************************************/

