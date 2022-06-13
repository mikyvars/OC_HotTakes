const express = require('express')
const router = express.Router()
const sauceController = require('../controllers/sauce')

const auth = require('../middlewares/auth')
const userId = require('../middlewares/userId')
const multer = require('../middlewares/multer-config')

router.get('/', auth, sauceController.getSauces)
router.get('/:id', auth, sauceController.getOneSauce)
router.post('/', auth, multer, sauceController.addSauce)
router.put('/:id', auth, userId, multer, sauceController.modifySauce)
router.delete('/:id', auth, userId, sauceController.deleteSauce)
router.post('/:id/like', auth, sauceController.likeSauce)

module.exports = router