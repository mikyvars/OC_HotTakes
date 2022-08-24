require('dotenv').config()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const webToken = require('jsonwebtoken')

// function to register on the website
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })

            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé.'}))
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}

// function to login on the website
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(404).json({error: 'Utilisateur non trouvé.'})
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({message: 'Mot de passe invalide.'})
                    }

                    res.status(200).json({
                        userId: user._id,
                        token: webToken.sign(
                            {userId: user._id},
                            process.env.SECRET_TOKEN,
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}