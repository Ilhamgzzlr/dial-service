const router = require('express').Router()
const dial = require('./dialRouter')

router.use('/', dial)

module.exports = router