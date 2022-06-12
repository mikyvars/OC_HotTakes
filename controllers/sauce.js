const Sauce = require('../models/Sauce')
const fs = require('fs')

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({error}))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({error}))
}

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

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée.'}))
        .catch(error => res.status(400).json({error}))
}

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

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId
    const like = req.body.like

    Sauce.findOne({_id: req.params.id})
        .then(sauce => {

            if(!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
                
                if(like === 1) {
                    sauce.usersLiked.push(userId)
                    sauce.likes++
                } else if(like === -1) {
                    sauce.usersDisliked.push(userId)
                    sauce.dislikes++
                }
            } else if(like === 1 && sauce.usersLiked.includes(userId)) {
                const userIndex = sauce.usersLiked.findIndex(user => user === userId)
                sauce.usersLiked.splice(userIndex, 1)
                sauce.likes--
            } else if(like === -1 && sauce.usersDisliked.includes(userId)) {
                const userIndex = sauce.usersDisliked.findIndex(user => user === userId)
                sauce.usersDisliked.splice(userIndex, 1)
                sauce.dislikes--
            }

            sauce.save()
                .then(() => {
                    res.status(200).json({message: 'Like/Dislike ajouté.'})
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}