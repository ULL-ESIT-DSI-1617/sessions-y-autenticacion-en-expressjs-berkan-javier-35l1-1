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

//CREANDO FUNCIÓN DE AUTENTICACIÓN EN LA QUE SE HACE next() SOLO SI EL LOG ES CORRECTO
var auth = function(req, res, next) {
    if (req.session.admin)
      return next();
    else
      res.render('login',{message: "INICIA SESIÓN PARA VER EL CONTENIDO."});
};

//COMPARAMOS LAS VARIABLES DEL POST CON EL bodyParser Y COMPARAMOS CON LOS USUARIOS CREADOS PARA SABER SI EL LOG ES CORRECTO. SI LO ES MODIFICAMOS LAS VARIABLES DE SESIÓN.
app.post('/login', function (req,res){
  var json = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  if(req.body.username=json &&
                bcrypt.compareSync(req.body.password, json[req.body.username])) {
    req.session.user = req.body.username;
    req.session.admin = true;
    res.redirect('/content')
  } else {
    res.render('login',{message: "ERROR DE INICIO DE SESIÓN."})
  }
});

//ESCRIBIMOS EL NUEVO USUARIO EN EL FICHERO users.json.
app.post('/register', function (req,res){
  var obj = require('./users.json');
  obj[req.body.username] = bcrypt.hashSync(req.body.password);
  fs.writeFile('./users.json', JSON.stringify(obj,"",4), function(err) {
    console.log(err);
  })
  res.render('login',{message: "REGISTRO REALIZADO, INICIE SESIÓN."})
});

//CAMBIAMOS LA CONTRASEÑA EN EL FICHERO users.json
app.post('/changepassword', function (req,res){
  var json = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  var obj = require('./users.json');
  obj[req.body.username] = bcrypt.hashSync(req.body.newpassword);
  if(req.body.username=json  &&
                bcrypt.compareSync(req.body.oldpassword, json[req.body.username])) {
    fs.writeFile('./users.json', JSON.stringify(obj,"",4), function(err) { console.log(err);
    })
    res.render('login',{message: "CONTRASEÑA CAMBIADA. INICIE SESIÓN."})
  } else {
    res.render('changepassword',{message: "CREDENCIALES INCORRECTAS, INTÉNTELO DE NUEVO."})
  }
});


app.use('/content', express.static(path.join(__dirname, 'public')));

//Asignamos un puerto al servidor, en este caso el puerto 8080.
app.set('port', (process.env.PORT || 8090));
//Puerto escucha del servidor mostrado por consola.
app.listen(app.get('port'), function() {
  console.log('App ejecutándose en el puerto', app.get('port'));
});
