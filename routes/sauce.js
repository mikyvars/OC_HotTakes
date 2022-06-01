const express = require('express')
const router = express.Router()
const sauceController = require('../controllers/sauce')

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.get('/', auth, sauceController.getSauces)
router.post('/', auth, multer, sauceController.addSauce)

module.exports = router