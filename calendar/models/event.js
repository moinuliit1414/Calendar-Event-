/****************************************************/
// Filename: Model\event.js
// Created: Moinul Islam<moinul39.iit@gmail.com>
// Change history:
// 26.09.2017 / Moinul Islam<moinul39.iit@gmail.com>
/****************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//********************************** Event Model***************************************
/// <summary>
///     Schema definition for collection "event"
/// </summary>
var EventSchema = Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  startat:{ type: Date , required: true },
  endat:{ type: Date , required: true },
  isfullday:{type: Boolean}
});

/// <summary>
///		Export EventSchema model as Event
/// </summary>

var Event = module.exports = mongoose.model('Event', EventSchema,'event');

//********************************** Get All Event***************************************
/// <summary>
///     Business logic for get all Event.
/// </summary>
/// <param name="callback">
///    Callback method after find all.
/// </param>
module.exports.getEvents=function(callback,limit){
	Event.find(callback);
}

//********************************** Add Event **************************************
/// <summary>
///     Business logic before add Event.
/// </summary>
/// <param name="evn">
///    Event object which to be updated.
/// </param>
/// <param name="callback">
///    Callback method after update.
/// </param>
module.exports.addEvent=function(evn,callback){
	console.log('event add model'+JSON.stringify(evn));
	var evnObject=new Event({
		title: evn.title,
		description: evn.description,
		startat: new Date (evn.startat),
		endat:new Date (evn.endat),
		isfullday:evn.allDay
	});
	console.log('event add model constructor fail'+JSON.stringify(evnObject));
	evnObject.save(callback);
}

//********************************** Update Event by id***************************************
/// <summary>
///     Update Event in db
/// </summary>
/// <param name="id">
///    Event id 
/// </param>
/// <param name="evn">
///    Event object which to be updated.
/// </param>
/// <param name="callback">
///    Callback method after update.
/// </param>
module.exports.updateEvent=function(id,evn,callback){
	console.log('event update model'+JSON.stringify(evn));
	
	var evnObject=new Event({
		title: evn.title,
		description: evn.description,
		startat: new Date (evn.startat),
		endat:new Date (evn.endat),
		isfullday:evn.allDay
	});
	//Event.findOneAndUpdate(query, evn, callback);
	Event.findByIdAndUpdate(id,{$set:evn},{new: true},callback);
}
/****************************************************/
// EOF: Model\event.js
/****************************************************/