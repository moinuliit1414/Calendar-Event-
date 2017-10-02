/****************************************************/
// Filename: public\scripts\MyApp.js
// Created: Moinul Islam<moinul39.iit@gmail.com>
// Change history:
// 29.09.2017 / Moinul Islam<moinul39.iit@gmail.com>
/****************************************************/
var app = angular.module('myApp', ['ui.calendar','ui.bootstrap']).run(['$rootScope', function($rootScope) {}]);

//********************************** Handle to get list all evens  by [GET]***************************************
/// <summary>
///     Factory for Broadcasting and Listining socket Post
/// </summary>
/// <param name="$rootScope">
///    Event request.URL format is URL="/api/event/" or URL="/api/"
/// </param>
app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);


// Controller for popOver create new/edit modal created from Calendar
var NewModalInstanceCtrl = function ($scope,$http, $modalInstance, event) {
	console.log('Opening modal controller...' +JSON.stringify(event));
	if('id' in event){
		$scope.newEvent={"id":event.id,
						"title": event.title,
						"description": event.description,
						"startat": new Date(event.start).toISOString(),
						"endat": new Date(event.end).toISOString(),
						"allDay": event.allDay};
	}else{
		var date = new Date(event);var d = date.getDate();var m = date.getMonth();var y = date.getFullYear();			
		$scope.newEvent={"startat":date.toISOString(),"endat":date.toISOString(),"allDay":false};
	}
	
	
	$scope.ErrorMessage="";
	
/// <summary>
///     update existing Event(update button action perform)
/// </summary>
/// <param name="newEvent">
///    Form Model
/// </param>

	$scope.updateData = function (newEvent) {
		console.log('update clicked with '+JSON.stringify(newEvent));
	 $http({
        url: '/api/event/'+newEvent.id+'/update',
        method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: function(obj) { //transform object to urlencoded
			var str = [];
			for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			console.log(str.join("&"));
			return str.join("&");
		},
        data: newEvent
    })
    .then(function(response) {
		var data=response.data;
		console.log('Updated data '+JSON.stringify(data));
		if(data.result=="success"){
			$scope.ErrorMessage="";
			$modalInstance.close({"id":data.data._id,
						"title": data.data.title,
						"description": data.data.description,
						"start":  new Date( Date.parse( data.data.startat )),
						"end": new Date( Date.parse( data.data.endat )),
						"allDay": data.data.isfullday,
						"stick": true});			
		}else if(data.result=="fail"){
			console.log('inserted fail '+data.message)
			$scope.ErrorMessage=data.message;
		}
            // success
    }, 
    function(response) { // optional
            // failed
			$scope.ErrorMessage=response.data.message;
    });
	};

/// <summary>
///     Add Event(save button action perform)
/// </summary>
/// <param name="newEvent">
///    Form Model
/// </param>	
	$scope.saveData = function (newEvent) {
		console.log('baiuofbv '+JSON.stringify(newEvent));
	 $http({
        url: '/api/event/create/',
        method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: function(obj) { //transform object to urlencoded
			var str = [];
			for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			console.log(str.join("&"));
			return str.join("&");
		},
        data: newEvent
    })
    .then(function(response) {
		var data=response.data;
		console.log('inserted data '+JSON.stringify(data));
		if(data.result=="success"){
			$scope.ErrorMessage="";
			$modalInstance.close({"id":data.data._id,
						"title": data.data.title,
						"description": data.data.description,
						"start":  new Date( Date.parse( data.data.startat )),
						"end": new Date( Date.parse( data.data.endat )),
						"allDay": data.data.isfullday,
						"stick": true});			
		}else if(data.result=="fail"){
			console.log('inserted fail '+data.message)
			$scope.ErrorMessage=data.message;
		}
            // success
    }, 
    function(response) { // optional
            // failed
			$scope.ErrorMessage=data.message;
    });
  };

  $scope.cancelForm = function () {
    $modalInstance.dismiss('cancel');
  };  
};


app.controller('myNgController', ['$scope','$http','$modal','$timeout','socket', 'uiCalendarConfig', function ($scope,$http, $modal,$timeout,socket, uiCalendarConfig) {
    
    $scope.SelectedEvent = null;
    var isFirstTime = true;

    $scope.events = [];
    $scope.eventSources = [$scope.events];
	
	$scope.defaultView='month';
	
	$scope.ErrorMessage=null;
	$scope.SuccessMessage=null;
	
	if(window.innerWidth<768){
		$scope.defaultView='listWeek';
	}
	
	/// <summary>
	///     listining server event EventAdded
	/// </summary>
	/// <param name="newEvent">
	///    Callback with data
	/// </param>	
	socket.on('EventAdded', function (data) {
		console.log("event data"+data);
		var event={id:data.data._id,
						title: data.data.title,
						description: data.data.description,
						start:  new Date( Date.parse( data.data.startat )),
						end: new Date( Date.parse( data.data.endat )),
						allDay: data.data.isfullday,
						stick: true}
		$scope.events.push(event);
	});
	
	/// <summary>
	///     listining server event EventUpdated
	/// </summary>
	/// <param name="data">
	///    Callback with data
	/// </param>
	socket.on('EventUpdated', function (data) {
		console.log("event data "+JSON.stringify(data));
		//var totalEvent=$scope.events.length;
		
		var event={id:data.data._id,
						title: data.data.title,
						description: data.data.description,
						start:  new Date( Date.parse( data.data.startat )),
						end: new Date( Date.parse( data.data.endat )),
						allDay: data.data.isfullday,
						stick: true}
		for (let evn of $scope.events) {
			if (evn.id === event.id) {
				var a=$scope.events.indexOf(evn);
				$scope.events[a]=event;
				//this.orders.splice(this.orders.indexOf(order), 1);
				//break;
			}
		}
        $scope.$apply();// apply scope value chaange
		
	});
	
	
    //Load events from server on first time
    $http.get('/api/', {
		headers: [{'Content-Type': 'application/json'}] ,
        cache: true,
        params: {}
    }).then(function (data) {
		console.log('value ' +JSON.stringify(data));
        $scope.events.slice(0, $scope.events.length);
        angular.forEach(data.data, function (value) {
			console.log('event value ' +JSON.stringify(value));
			var evn={id:value._id,
                title: value.title,
                description: value.description,
				// start:  new Date( Date.parse( value.startat )),
                // end: new Date( Date.parse( value.endat )),
				start:  new Date(  value.startat ),
                end: new Date( value.endat ),
                //start: new Date(parseInt(value.startat.substr(6))),
                //end: new Date(parseInt(value.endat.substr(6))),
                allDay: value.isfullday,
                stick: true};
			console.log('event value ' +JSON.stringify(evn));
            $scope.events.push(evn);
        });
    });
	
	$scope.open = function() {
		$scope.openModal();
	};
	
	// Open popover event form  from Calender
	$scope.openModal = function (eventObj) {
		console.log('Opening modal...'+JSON.stringify(eventObj));
		  var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'newModalContent.html',
			controller: NewModalInstanceCtrl,
			backdrop: false,
			resolve: {
			  event: function () {
				  console.log('resonving dependency'+JSON.stringify(eventObj));
				return eventObj;
			  }
			}
		 });
    
		// Scope apply here to make modal show up
		$timeout( function(){
			$scope.SuccessMessage="";
			console.log('Opening modal...');
			$scope.$apply(function() {
			  modalInstance.result.then(
				function (event) {
					//$scope.events.push(event);
					console.log('Modal closed at: ' + new Date());
					console.log(event);
					$scope.SuccessMessage="event added Sucessfully...";
					//$scope.events.push(event);
					modalInstance.close();
					setTimeout(function () {
					  $scope.$apply(function(){
						  $scope.SuccessMessage="";
					  });
					}, 5000);
				}, 
				function () {
				  console.log('Modal dismissed at: ' + new Date());
				}
			  );
			});
		},0);
		$scope.SuccessMessage="";
    
	};
  
	//with this you can handle the events that generated by each page render process
    $scope.renderView = function(view){    
        var date = new Date(view.calendar.getDate());
        $scope.currentDate = date.toDateString();
        
    };
	
    //configure calendar
    $scope.uiConfig = {
        calendar: {
            height: 500,
            editable: true,
            displayEventTime: true,
			dayClick: function(event) {console.log('Day clicking');$scope.openModal(event)},
            header: {
                left: '',//'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right:'prev, today ,next'
            }, 
			editable: true,
            eventLimit: true, 
			//defaultView:'listWeek',
			windowResize:function(view){
				if($scope.defaultView==='listWeek' && window.innerWidth>768){
					$scope.uiConfig.calendar.defaultView=$scope.defaultView='month';
				}else if($scope.defaultView==='month' && window.innerWidth<=768){
					$scope.uiConfig.calendar.defaultView=$scope.defaultView='listWeek';
				}
				alert(window.innerWidth);
				// uiCalendarConfig.calendars["eventsCalendar"].fullCalendar('changeView',view);
				// $scope.changeView('listWeek');
			},
			defaultView:$scope.defaultView,//(window.innerWidth<= 800)? 'listWeek':'month',
			eventClick:function(calEvent, jsEvent, view) {				
				if(calEvent.end==null){
					calEvent.end=calEvent.start;
				}
				console.log('Event clicking'+calEvent.end );
				var event={id:calEvent.id,
					title: calEvent.title,
					description: calEvent.description,
					start:  new Date( calEvent.start ),
					end: new Date(calEvent.end ),
					allDay: calEvent.allDay,
					stick: true}
				$scope.SelectedEvent = event;
				$scope.openModal($scope.SelectedEvent)
			},
			//viewRender: $scope.renderView,
            eventAfterAllRender: function () {
                if ($scope.events.length > 0 && isFirstTime) {
                    //Focus first event
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    isFirstTime = false;
                }
            }
        }
    };
}])
/****************************************************/
// EOF: public\scripts\MyApp.js
/****************************************************/