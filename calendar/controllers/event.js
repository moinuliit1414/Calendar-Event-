/****************************************************/
// Filename: controllers\event.js
// Created: Moinul Islam<moinul39.iit@gmail.com>
// Change history:
// 26.09.2017 / Moinul Islam<moinul39.iit@gmail.com>
/****************************************************/

var Event = require('../Business Layer/event');

// Display list of all Event
//********************************** Handle to get list all evens  by [GET]***************************************
/// <summary>
///     Handles post request for creat event.
/// </summary>
/// <param name="req">
///    Event request.URL format is URL="/api/event/" or URL="/api/"
/// </param>
/// <param name="res">
///    Event response.
/// </param>

exports.event_list = function(req, res) {	
	console.log('event list controller');
	Event.getEvents(function(err,Events){
		if(err){
			console.log('error ')
			throw err;
		}else if(Events == null || Events.length === 0){
			res.send('NO EVENT FOUND: No Event found in database');
		}else{			
			res.json(Events);
		}		
	});	
    //res.send('NOT IMPLEMENTED: EventInstance list');
};

// Display detail page for a specific Event
exports.event_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Event detail: ' + req.params.id);
};

// Display Event create form on GET
exports.event_create_get = function(req, res) {
	console.log('sucess ')
    res.send('NOT IMPLEMENTED: Event create GET');
};


//********************************** Handle Event create by [POST]***************************************
/// <summary>
///     Handles post request for creat event.
/// </summary>
/// <param name="req">
///    Event request.URL format is URL="/api/event/create"
/// </param>
/// <param name="res">
///    Event response.
/// </param>
exports.event_create_post = function(req, res) {
    console.log('event creat controller post');
	var evn=req.body;
	console.log(evn);
	//global.io.emit('EventAdded', 'Event inserted sucessfully');
	console.log('event creat controller post');
	Event.addEvent(evn,function(err,Event){
		if(err){
			console.log('error ')
			var result={"result":"fail","message":"opps somthing wrong...."+err.toString()};
			res.json(result)
			//throw err;
		}else if(Event == null || Event.length === 0){
			var result={"result":"fail","message":"opps somthing wrong...."};
			//res.send('NO EVENT FOUND: No Event found in database');
			res.json(result)
		}else{		
			var result={"result":"success","message":"Event inserted sucessfully","data":Event};
			global.io.emit('EventAdded', result);
			res.json(result);			
		}		
	});
};

// Handle Event create on PUT
exports.event_create_put = function(req, res) {
    console.log('event creat controller');
	var evn=req.body;
	console.log(JSON.stringify(req));
	Event.getEvents(evn,function(err,Event){
		if(err){
			console.log('error ')
			throw err;
		}else if(Event == null || Event.length === 0){
			res.send('NO EVENT FOUND: No Event found in database');
		}else{			
			res.json(Event);
		}		
	});
};


// Display Event delete form on GET
exports.event_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event delete GET');
};

// Handle Event delete on POST
exports.event_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Event delete POST');
};

// Display Event update form on GET
exports.event_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event update GET');
};

//********************************** Handle Event update by [POST]***************************************
/// <summary>
///     Handles post request for update event.
/// </summary>
/// <param name="req">
///    Event request.URL format is URL="/api/event/:id/update"
/// </param>
/// <param name="res">
///    Event response.
/// </param>
exports.event_update_post = function(req, res) {
    //res.send('NOT IMPLEMENTED: Event update POST');
	console.log('event update controller [post]');
	
	var id=req.params.id;
	var evn=req.body;
	console.log(evn);
	console.log('event Update controller post');
	Event.updateEvent(id,evn,function(err,Event){
		if(err){
			console.log('error ');
			var result={"result":"fail","message":"opps somthing wrong...."+err.toString()};
			res.json(result);
			//throw err;
		}else if(Event == null || Event.length === 0){
			var result={"result":"fail","message":"opps somthing wrong...."};
			res.json(result)
		}else{		
			var result={"result":"success","message":"Event Updated sucessfully","data":Event};
			console.log('EventUpdated', result);
			global.io.emit('EventUpdated', result);//Broadcust result after sucessfully updated.
			res.json(result);//send response in j son formate.			
		}		
	});
};

/****************************************************/
// EOF: controllers\event.js
/****************************************************/