var app = angular.module('myApp', ['ui.calendar','ui.bootstrap']).run(['$rootScope', function($rootScope) {
    $rootScope.safeApply = function(fn) {
        
        if (this.$root && this.$root.$$phase) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        } else {
            $scope.$apply(fn);
          
        }

    };
}]);

// Controller for modal created from other modal
var NewModalInstanceCtrl = function ($scope,$http, $modalInstance, event) {
	console.log('Opening modal controller...' +JSON.stringify(event));
	var date = new Date(event);var d = date.getDate();var m = date.getMonth();var y = date.getFullYear();
	
	$scope.ErrorMessage="";
	$scope.newEvent={"startat":date.toISOString(),"endat":date.toISOString(),"isfullday":false};
	
	// $scope.newEvent.title="Event";
	// $scope.newEvent.description="new test Event";
	// $scope.newEvent.startat=d.toISOString();
	// $scope.newEvent.endat=d.toISOString();
	// $scope.newEvent.isfullday=false;
	
	
	$scope.saveData = function (newEvent) {
		console.log('baiuofbv '+JSON.stringify(newEvent));
	 $http({
        url: '/api/event/create/',
        method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: function(obj) {
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
	
	// console.log('Opening modal controller...' +JSON.stringify(newEvent));
    // $modalInstance.close({"id":"yt753y4-t48t4",
						// "title": $scope.newEvent.title,
						// "description": $scope.newEvent.description,
						// "start":  new Date( Date.parse( $scope.newEvent.startat )),
						// "end": new Date( Date.parse( $scope.newEvent.endat )),
						// "allDay": $scope.newEvent.allDay,
						// "stick": true});
  };

  $scope.cancelForm = function () {
    $modalInstance.dismiss('cancel');
  };  
};

app.service('modalProvider',['$modal', function ($modal){

	var openPopupModal= function(eventObj) {
		var modalInstance = $modal.open({          
			templateUrl: 'newModalContent.html',
			controller: NewModalInstanceCtrl,
			backdrop: false,
			resolve: {
				event: function () {
				return eventObj;
				}
			}
		});
	}
	return openPopupModal;
}]);
app.controller('myNgController', ['$scope','$http','$modal','$timeout', 'uiCalendarConfig', function ($scope,$http, $modal,$timeout, uiCalendarConfig) {
    
    $scope.SelectedEvent = null;
    var isFirstTime = true;

    $scope.events = [];
    $scope.eventSources = [$scope.events];
	
	$scope.ErrorMessage=null;
	$scope.SuccessMessage=null;
	// var dialogOptions = {
    // controller: 'EditCtrl',
    // templateUrl: 'itemEdit.html'
	// };
	
    //Load events from server
    $http.get('/api/', {
		headers: [{'Content-Type': 'application/json'}] ,
        cache: true,
        params: {}
    }).then(function (data) {
		console.log('value ' +JSON.stringify(data));
        $scope.events.slice(0, $scope.events.length);
        angular.forEach(data.data, function (value) {
			
            $scope.events.push({
				id:value._id,
                title: value.title,
                description: value.description,
				start:  new Date( Date.parse( value.startat )),
                end: new Date( Date.parse( value.endat )),
                //start: new Date(parseInt(value.startat.substr(6))),
                //end: new Date(parseInt(value.endat.substr(6))),
                allDay: value.isfullday,
                stick: true
            });
        });
    });
	
	$scope.open = function() {
		$scope.openModal();
	};
	
	// Open modal from modal
	$scope.openModal = function (eventObj) {
		console.log('Opening modal...');
		  var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'newModalContent.html',
			controller: NewModalInstanceCtrl,
			backdrop: false,
			resolve: {
			  event: function () {
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
					$scope.events.push(event);
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
  
	// $scope.alertOnEventClick = function( date,allDay,jsEvent, view) {
            // $scope.alertMessage = (' was clicked ');
    // };
    //configure calendar
    $scope.uiConfig = {
        calendar: {
            height: 500,
            editable: true,
            displayEventTime: true,
			dayClick: function(event) {console.log('Day clicking');$scope.openModal(event)},
            header: {
                left: 'prev',//'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right:'today prev,next'
            },
			//eventClick:function(event) {console.log('event clicking');$scope.openModal(event)},
             eventClick: function (event) {
                 $scope.SelectedEvent = event;
             },
            eventAfterAllRender: function () {
                if ($scope.events.length > 0 && isFirstTime) {
                    //Focus first event
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    isFirstTime = false;
                }
            }
        }
    };
	
	// $scope.PopUpEvent = function(index) {
        // alert('b yud cu');
    // };

}])
