"use strict";
//AÑADIENDO MIDDLEWARES
var express = require('express'),
    app = express(),
    session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var util = require("util");
var bodyParser = require('body-parser');
var bcrypt = require("bcrypt-nodejs");
var fs = require("fs")

//HABILITANDO bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//CONFIGURANDO VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//HABILITANDO Y USANDO cookieParser PARA MOSTRAR INFORMACIÓN DE LA SESIÓN
app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
  console.log("Cookies :  "+util.inspect(req.cookies));
  console.log("session :  "+util.inspect(req.session));
  next();
});


//Asignamos un puerto al servidor, en este caso el puerto 8080.
app.set('port', (process.env.PORT || 8090));
//Puerto escucha del servidor mostrado por consola.
app.listen(app.get('port'), function() {
  console.log('App ejecutándose en el puerto', app.get('port'));
});
