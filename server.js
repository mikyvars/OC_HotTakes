require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

// connect to the database with user and password in environment variables
mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()
app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
})

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