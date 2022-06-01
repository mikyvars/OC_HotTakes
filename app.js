const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

mongoose.connect('mongodb+srv://openclassroom:rdH2JvUWpMn2LnUN@cluster0.5pdc0.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection to MongoDB successful!'))
    .catch(() => console.log('Connection to MongoDB failed!'));

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(express.json())
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app