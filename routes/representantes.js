var express = require('express');
var router = express.Router();
var estudianteModel = require('../models/estudiante');
var representateModel = require('../models/representante');
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('representante-dash');
});

router.get('/has-seccion/:id', (req, res, next) => {
  var id = req.params.id;
  representateModel.findById(id).populate('ciHijos').exec((err, existRep) => {
    if(err) throw err;
    if(existRep) {
      if(existRep.ciHijos.length > 0) {
        res.json({ code: 200, hijos: existRep.ciHijos });
      } else {
        res.json({ code: 402, hijos: null });
      }
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/login', (req, res, next) => {
  res.render('representante-login');
});

router.post('/login', (req, res, next) => {
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  representateModel.findOne({ email: email }, (err, existRep) => {
    if(err) throw err;
    if(existRep) {
      if(existRep.password == password) {
        res.json({ code: 200, msg: 'Autenticado correctamente', token: existRep._id, user: existRep });
      } else {
        res.json({ code: 402, msg: 'Contraseña invalida' });
      }
    } else {
      res.json({ code: 404, msg: 'El usuario no existe' });
    }
  });
});

router.get('/ver-notas', (req, res, next) => {
  res.render('representante-ver-notas');
});
module.exports = router;
