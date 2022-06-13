const Sauce = require('../models/Sauce')
const fs = require('fs')

// function to get all sauce
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({error}))
}

// function to get selected sauce with id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({error}))
}

// function to create a new sauce
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce créé.'}))
        .catch(error => res.status(400).json({error}))
}

// function to modify an existing sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée.'}))
        .catch(error => res.status(400).json({error}))
}

// function to delete an existing sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée.'}))
                    .catch(error => res.status(400).json({error}))
            })
        })
        .catch(error => res.status(500).json({error}))
}

// function to like/dislike an existing sauce
exports.likeSauce = (req, res) => {

    Sauce.findOne({_id: req.params.id})
        .then(sauce => {

            if(sauce.usersLiked.indexOf(req.body.userId) == -1 && sauce.usersDisliked.indexOf(req.body.userId) == -1) {

                if(req.body.like == 1) {
                    sauce.usersLiked.push(req.body.userId)
                    sauce.likes += req.body.like
                } else if(req.body.like == -1) {
                    sauce.usersDisliked.push(req.body.userId)
                    sauce.dislikes -= req.body.like
                }
            }

            if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const index = sauce.usersLiked.findIndex(user => user === req.body.userId)
                sauce.usersLiked.splice(index, 1)
                sauce.likes -= 1
            }

            if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const index = sauce.usersDisliked.findIndex(user => user === req.body.userId)
                sauce.usersDisliked.splice(index, 1)
                sauce.dislikes -= 1
            }
            
            sauce.save()
                .then(() => {
                    res.status(200).json({message: 'Like/Dislike ajouté.'})
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}