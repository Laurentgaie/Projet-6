const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const dotenv = require('dotenv').config();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const app = express();


// Connexion à mongoose:
mongoose.connect('mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS - partage de ressources entre serveurs
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*'); // qui peut accéder à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // headers authorisés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //méthodes possibles
    next();
});

app.use(bodyParser.json()); //bodyparser

app.use(mongoSanitize()); // En prévention des injections
app.use(helmet()); // helmet

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));


app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion images de manière statiques
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
    
 // export de l'application
module.exports = app;