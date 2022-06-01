const express = require('express')
const router = express.Router()
const sauceController = require('../controllers/sauce')
const auth = require('../middlewares/auth')

router.get('/', auth, sauceController.getSauces)
router.post('/', auth, sauceController.addSauce)

module.exports = router