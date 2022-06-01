const Sauce = require('../models/Sauce')

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({error}))
}

exports.addSauce = (req, res, next) => {
    
}