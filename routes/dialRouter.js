const router = require('express').Router()
const dial = require('../controllers/dialController')
router.post('/dials', dial.create)
router.post('/dials/avg/:agent_id', dial.getAvgAgentHandlingTime)
router.post('/dials/prediction/:agent_id', dial.findNextHandlingTimePrediction)

module.exports = router