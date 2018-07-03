var express = require('express');
var router = express.Router();
var fs = require('fs');
var pdfkit = require('pdfkit');
var profesorModel = require('../models/profesor');
var materiaModel = require('../models/materia');
var profGradoMatModel = require('../models/prof_grado_mat');
var profTieneSecModel = require('../models/prof_tiene_sec');
var estTieneSecModel = require('../models/est_tiene_sec');
var notaModel = require('../models/nota');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('profesor-dash');
});

router.get('/login', function(req, res, next) {
  res.render('profesor-login');
});

router.post('/login', function(req, res, next) {
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  profesorModel.findOne({ email: email }, (err, existProf) => {
    if(err) throw err;
    if(existProf) {
      if(existProf.password == password) {
        res.json({ code: 200, msg: 'Autenticado correctamente', token: existProf._id, user: existProf });
      } else {
        res.json({ code: 402, msg: 'Contraseña invalida' });
      }
    } else {
      res.json({ code: 404, msg: 'El usuario no existe' });
    }
  });
});

router.get('/has-seccion/:id', (req, res, next) => {
  var id = req.params.id;
  profesorModel.findById(id, (err, existProf) => {
    if(err) throw err;
    if(existProf) {
      if(existProf.status == true) {
        res.json({ code: 200, msg: 'Has sido asignado a una sección, ya puedes utilizar las nuevas funciones' });
      } else {
        res.json({ code: 402, msg: 'Debes esperar que seas asignado a una sección para utiliar el resto de funciones' });
      }
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/register', (req, res, next) => {
  res.render('profesor-register');
});

router.post('/register', (req, res, next) => {
  var cedula = req.body.cedula.trim();
  var nombre = req.body.nombre.trim();
  var apellido = req.body.apellido.trim();
  var direccion = req.body.direccion.trim();
  var telefono = req.body.telefono.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  var grado = req.body.grado.trim();
  var materia = req.body.materia.trim();

  profesorModel.findOne({ email: email }, (err, existProf) => {
    if(err) throw err;
    if(existProf) {
      res.json({ code: 402, msg: 'Ya existe un usuario registrado con esta dirección de correo' });
    } else {
      profesorModel.findOne({ cedula: cedula }, (err, existProf2) => {
        if(err) throw err;
        if(existProf2) {
          res.json({ code: 402, msg: 'Ya existe un usuario registrado con este numero de cedula' });
        } else {
          var profesor = new profesorModel({
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            telefono: telefono,
            email: email,
            password: password
          });

          profesor.save((err, nuevoProfesor) => {
            if(err) throw err;
            var prof_grado_mat = new profGradoMatModel({
              idProfesor: nuevoProfesor._id,
              grado: grado,
              codigoMateria: materia
            });
            prof_grado_mat.save((err, nuevoProfGradoSec) => {
              if(err) throw err;
              res.json({ code: 200, msg: 'Registrado correctamente' });
            });
          });
        }
      });
    }
  });
});

router.delete('/dar-de-baja/:id', (req, res, next) => {
  var profId = req.params.id;
  profesorModel.deleteOne({ _id: profId }, (err) => {
    if(err) throw err;
    profGradoMatModel.deleteOne({ idProfesor: profId }, (err) => {
      if(err) throw err;
      res.json({ code: 200, msg: 'Profesor Eliminado'});
    });
  })
});

router.put('/update/:id', (req, res, next) => {
  var profId = req.params.id;
  var nombre = req.body.nombre.trim();
  var apellido = req.body.apellido.trim();
  var cedula = req.body.cedula.trim();
  var telefono = req.body.telefono.trim();
  var direccion = req.body.direccion.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  profesorModel.findById(profId, (err, profesor) => {
    if(err) throw err;
    if(profesor) {
      profesor.nombre = nombre;
      profesor.apellido = apellido;
      profesor.cedula = cedula;
      profesor.telefono = telefono;
      profesor.direccion = direccion;
      profesor.email = email;
      profesor.password = password;

      profesor.save((err, profesorActualizado) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Datos actualizados.', profesor: profesorActualizado });
      });
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/mis-datos', (req, res, next) => {
  res.render('profesor-mis-datos');
});

router.get('/mis-datos/:id', (req, res, next) => {
  var profId = req.params.id;
  profesorModel.findById(profId, (err, profesor) => {
    if(err) throw err;
    if(profesor) {
      profGradoMatModel.findOne({ idProfesor: profesor._id }, (err, profGradMat) => {
        if(err) throw err;
        if(profGradMat) {
          materiaModel.findOne({ codigo: profGradMat.codigoMateria }, (err, materia) => {
            if(err) throw err;
            if(materia) {
              res.json({ code: 200, profesor: profesor, grado: profGradMat.grado, materia: materia.nombre });
            } else {
              res.json({ code: 200, profesor: profesor, grado: profGradMat.grado, materia: null });
            }
          });
        } else {
          res.json({ code: 200, profesor: profesor, grado: null, materia: null });
        }
      });
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/listado-seccion', (req, res, next) => {
  res.render('profesor-listado-seccion');
});

router.get('/listado-estudiantes/:id', (req, res, next) => {
  var profId = req.params.id;
  profTieneSecModel.findOne({ idProfesor: profId }).populate('idProfesor').populate('idSeccion').exec((err, profSecc) => {
    if(err) throw err;
    if(profSecc) {
      estTieneSecModel.find({ idSeccion: profSecc.idSeccion, grado: profSecc.grado }).populate('idEstudiante').exec((err, estudiantes) => {
        if(err) throw err;
        console.log(estudiantes);
        if(estudiantes.length > 0) {
          res.json({ code: 200, estudiantes: estudiantes, profesor: profSecc });
        } else {
          res.json({ code: 403, estudiantes: null, profesor: profSecc });
        }
      });
    } else {
      res.json({ code: 404, msg: 'Not Found' });
    }
  });
});

router.get('/subir-notas', (req, res, next) => {
  res.render('profesor-subir-notas');
});

router.get('/estudiante/notas/:id', (req, res, next) => {
  var profId = req.params.id;
  profTieneSecModel.findOne({ idProfesor: profId }).populate('idSeccion').exec((err, prof) => {
    if(err) throw err;
    if(prof) {
      notaModel.find({ idProfesor: prof.idProfesor }).populate('idEstudiante').exec((err, notasE) => {
        if(err) throw err;
        if(notasE.length > 0) {
          res.json({ code: 200, notas: notasE });
        } else {
          res.json({ code: 403, notas: null });
        }
      });
    } else {
      res.json({ code: 404, msg: 'not found' });
    }
  });
});

router.post('/subir-nota/:id', (req, res, next) => {
  var profId = req.params.id;
  var estudiante = req.body.estudiante.trim();
  var nota = req.body.nota.trim();
  var lapso = req.body.lapso.trim();
  profTieneSecModel.findOne({ idProfesor: profId }, (err, profSec) => {
    if(err) throw err;
    if(profSec) {
      notaModel.findOne({ idProfesor: profId, idEstudiante: estudiante, idSeccion: profSec.idSeccion, lapso: lapso }, (err, notaEst) => {
        if(err) throw err;
        if(notaEst) {
          res.json({ code: 402, msg: 'Ya se le ha asignado una nota para este lapso' });
        } else {
          var notaNueva = new notaModel({
            materia: profSec.codigoMateria,
            grado: profSec.grado,
            idEstudiante: estudiante,
            idProfesor: profId,
            idSeccion: profSec.idSeccion,
            lapso: lapso,
            nota: nota
          });
          notaNueva.save((err, notaN) => {
            if(err) throw err;
            res.json({ code: 200, msg: 'Nota Cargada' });
          });
        }
      });
    } else {
      res.json({ code: 404, msg: 'not found' });
    }
  });
});
module.exports = router;
