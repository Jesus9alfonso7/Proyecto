const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('src/public'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(require('./controllers/authController'));

module.exports = app;