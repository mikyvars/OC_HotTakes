require('dotenv').config()
const webToken = require('jsonwebtoken')
const Sauce = require('../models/Sauce')

module.exports = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = webToken.verify(token, process.env.SECRET_TOKEN)
            const userId = decodedToken.userId

            if(sauce.userId && sauce.userId == userId) {
                next()
            } else {
                res.status(403).json({message: "Requête non authorisée"})
            }
        })
        .catch(error => res.status(401).json({error}))
}