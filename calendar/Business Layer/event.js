/****************************************************/
// Filename: Business Layer\event.js
// Created: Moinul Islam<moinul39.iit@gmail.com>
// Change history:
// 26.09.2017 / Moinul Islam<moinul39.iit@gmail.com>
/****************************************************/
var Event = require('../Models/event');


//********************************** Get All Event***************************************
/// <summary>
///     Business logic for get all Event.
/// </summary>
/// <param name="callback">
///    Callback method after find all.
/// </param>
exports.getEvents = function (callback){	
	console.log('event list business layer');
	Event.getEvents(callback);
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
exports.addEvent = function (evn,callback){	
	console.log('event add business layer');	
	Event.addEvent(evn,callback);
}

//********************************** Update Event by id***************************************
/// <summary>
///     Business logic before update Event.
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
exports.updateEvent = function (id,evn,callback){	
	console.log('event update business layer');	
	//var query={_id:id};
	Event.updateEvent(id,evn,callback);
}
/****************************************************/
// EOF: Business Layer\event.js
/****************************************************/