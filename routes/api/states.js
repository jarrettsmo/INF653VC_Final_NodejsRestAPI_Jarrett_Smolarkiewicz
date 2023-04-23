const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStateFacts)
    .post(statesController.createNewStateFact)
    .put(statesController.updateStateFact)
    .delete(statesController.deleteStateFact);

router.route('/:id')
    .get(statesController.getStateFact);

module.exports = router;