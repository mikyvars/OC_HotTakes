const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

// connect to the database with user and password in environment variables
mongoose.connect(`mongodb+srv://${process.env.MDB_USER || 'openclassroom'}:${process.env.MDB_PASS || 'rdH2JvUWpMn2LnUN'}@${process.env.MDB_HOST || 'cluster0.5pdc0.mongodb.net'}/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection to MongoDB successful!'))
    .catch(() => console.log('Connection to MongoDB failed!'));

const app = express()
app.use(express.json())

// secure server by setting various HTTP headers 
app.use(helmet());

// secure CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
	next();
});

// define main accesses
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app