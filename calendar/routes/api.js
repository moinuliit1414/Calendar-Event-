var express = require('express');
var router = express.Router();

// Require controller modules
var event_controller = require('../controllers/event');

/// EVENT ROUTES ///
 
/* GET event home page. */
router.get('/', event_controller.event_list);

/* GET request for creating a Event. NOTE This must come before routes that display Book (uses id) */
router.get('/event/create', event_controller.event_create_get);

/* POST request for creating Event. */
router.post('/event/create', event_controller.event_create_post);

/* PUT request for creating Event. */
router.put('/event/create', event_controller.event_create_put);

/* GET request to delete Event. */
router.get('/event/:id/delete', event_controller.event_delete_get);

// POST request to delete Event
router.post('/event/:id/delete', event_controller.event_delete_post);

/* GET request to update Event. */
router.get('/event/:id/update', event_controller.event_update_get);

// POST request to update Event
router.post('/event/:id/update', event_controller.event_update_post);

/* GET request for one Event. */
router.get('/event/:id', event_controller.event_detail);

/* GET request for list of all Event items. */
router.get('/event', event_controller.event_list);


module.exports = router;