var express = require('express');
var router = express.Router();

var ajusteModel = require('../models/ajuste');
var adminModel = require('../models/admin');
var profesorModel = require('../models/profesor');
var estudianteModel = require('../models/estudiante');
var materiaModel = require('../models/materia');
var seccionModel = require('../models/seccion');
var estTieneSeccModel = require('../models/est_tiene_sec');
var profTieneSeccModel = require('../models/prof_tiene_sec');
var profGradoMatModel = require('../models/prof_grado_mat');
var horarioModel = require('../models/horario');
/* GET users listing. */

router.get('/', (req, res, next) => {
  res.render('admin-dash');
});

router.get('/login', function(req, res, next) {
  res.render('admin-login');
});

router.post('/login', (req, res, next) => {
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  adminModel.findOne({ email: email }, (err, existAdmin) => {
    if(err) throw err;
    if(existAdmin) {
      if(existAdmin.password == password) {
        res.json({ code: 200, msg: 'Autenticado correctamente.', token: existAdmin._id, user: existAdmin });
      } else {
        res.json({ code: 402, msg: 'Contraseña Incorrecta' });
      }
    } else {
      res.json({ code: 404, msg: 'El usuario no existe' });
    }
  });
});

router.get('/register', (req, res, next) => {
  res.render('admin-register');
});

router.post('/register', (req, res, next) => {
  var nombre = req.body.nombre.trim();
  var apellido = req.body.apellido.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  adminModel.findOne({ email: email }, (err, existAdmin) => {
    if(err) throw err;
    if(existAdmin) {
      res.json({ code: 402, msg: 'Ya existe un administrador con este correo' });
    } else {
      var admin = new adminModel({
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password
      });

      admin.save((err, newAdmin) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Nuevo administrador creado'});
      });
    }
  });
});

//-----------------ACCIONES DE SECCION------------------
router.get('/crear-seccion', (req, res, next) => {
  res.render('admin-crear-seccion');
});

router.post('/crear-seccion', (req, res, next) => {
  var nombre = req.body.nombre.trim();
  var grado = req.body.grado.trim();
  seccionModel.findOne({ grado: grado, nombre: nombre }, (err, existSeccion) => {
    if(err) throw err;
    if(existSeccion) {
      res.json({ code: 402, msg: 'Ya exite una sección registrada con este nombre para este grado' });
    } else {
      var seccion = new seccionModel({
        nombre: nombre,
        grado: grado
      });
      seccion.save((err, nuevaSeccion) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Sección creada.' })
      });
    }
  });
});

router.get('/secciones', (req, res, next) => {
  seccionModel.find({}, (err, secciones) => {
    if(err) throw err;
    if(secciones.length > 0) {
      res.json({ code: 200, secciones: secciones });
    } else {
      res.json({ code: 404, secciones: null }); 
    }
  });
});

router.get('/seccion-profesores', (req, res, next) => {
  res.render('admin-asignar-profesores');
});

router.post('/seccion-profesores', (req, res, next) => {
  var seccionT = req.body.seccion.trim();
  var profesor = req.body.profesor.trim();
  var grado = req.body.grado.trim();
  var dia = req.body.dia.trim();
  var horaI = req.body.horaI.trim();
  profGradoMatModel.findOne({ idProfesor: profesor }, (err, prof) => {
    if(err) throw err;
    if(prof) {
      profTieneSeccModel.find({ grado: grado, idSeccion: seccionT }, (err, exist) => {
        if(err) throw err;
        if(exist.length > 0) {
          exist.map((seccion, i) => {
            console.log('Aqui 1');
            if(seccion.codigoMateria == prof.codigoMateria && seccion.dia == dia) {
              res.json({ code: 402, msg: 'Ya existe un profesor asignado a esta seccion con esta materia'});
              console.log('Aqui 2');
            } else if(seccion.dia == dia && seccion.horaI == horaI){
                res.json({ code: 402, msg: 'Ya existe una materia registrada a esta hora en este dia' });
                console.log('Aqui 3');
            } else {
              console.log('Aqui 4');
              var profInSec3 = new profTieneSeccModel({
                idSeccion: seccionT,
                idProfesor: profesor,
                grado: grado,
                codigoMateria: prof.codigoMateria,
                dia: dia,
                horaI: horaI
              });
              console.log('Aqui 5');
              profInSec3.save((err, newPS3) => {
                if(err) throw err;
                console.log('Aqui 6');
                prof.idProfesor.status = true;
                prof.save((err, lis) => {
                  if(err) throw err;
                  console.log('Aqui 7');
                  res.json({ code: 200, msg: 'Asignado a la Seccion' });
                });
              });
            }
          });
        } else {
          console.log('Aqui 8');
          var profInSec2 = new profTieneSeccModel({
            idSeccion: seccionT,
            idProfesor: profesor,
            grado: grado,
            codigoMateria: prof.codigoMateria,
            dia: dia,
            horaI: horaI
          });
          profInSec2.save((err, newPS2) => {
            if(err) throw err;
            console.log('Aqui 9');
            prof.idProfesor.status = true;
            prof.save((err, lis) => {
              if(err) throw err;
              console.log('Aqui 10');
              res.json({ code: 200, msg: 'Asignado a la Seccion' });
            });
          });
        }
      });
    } else {
      res.json({ code: 404, msg: 'Not Found' });
    }
  });
});

router.get('/get-secciones-profesor/:grado', (req, res, next) => {
  var grado = req.params.grado;
  seccionModel.find({ grado: grado }, (err, secciones) => {
    if(err) throw err;
    if(secciones.length > 0) {
      profGradoMatModel.find({ grado: grado }).populate('idProfesor').exec((err, profesores) => {
        if(err) throw err;
        if(profesores.length > 0) {
          res.json({ code: 200, secciones: secciones, profesores: profesores });
        } else {
          res.json({ code: 201, secciones: secciones, profesores: null });
        }
      });
    } else {
      profesorModel.find({ grado: grado }, (err, profesores) => {
        if(err) throw err;
        if(profesores.length > 0) {
          res.json({ code: 202, secciones: null, profesores: profesores });
        } else {
          res.json({ code: 404, secciones: null, profesores: null });
        }
      });
    }
  });
});

router.get('/profesores/listar-seccion', (req, res, next) => {
  profTieneSeccModel.find({}).populate('idSeccion').populate('idProfesor').exec((err, profSec) => {
    if(err) throw err;
    if(profSec.length > 0) {
      res.json({ code: 200, profesores: profSec });
    } else {
      res.json({ code: 404, profesores: null });
    }
  });
});

router.get('/seccion-estudiantes', (req, res, next) => {
  res.render('admin-asignar-estudiantes');
});

router.post('/seccion-estudiantes', (req, res, next) => {
  var grado = req.body.grado.trim();
  var seccion = req.body.seccion.trim();
  var estudiante = req.body.estudiante.trim();
  estTieneSeccModel.find({ idSeccion: seccion }, (err, totalSeccion) => {
    if(err) throw err;
    if(totalSeccion.length > 0) {
      if(totalSeccion.length < 30) {
        var nuevoEnSeccion = new estTieneSeccModel({
          idSeccion: seccion,
          idEstudiante: estudiante,
          grado: grado
        });
        nuevoEnSeccion.save((err, nuevoEnSeccionListo) => {
          if(err) throw err;
          estudianteModel.findById(estudiante, (err, estudianteExist) => {
            if(err) throw err;
            estudianteExist.status = true;
            estudianteExist.save((err, estudianteUpdateStatus) => {
              if(err) throw err;
              res.json({ code: 200, msg: 'Colocado en la seccion' });
            });
          });
        });
      } else {
        res.json({ code: 402, msg: 'Se ha alcanzado el limite de cupos para la seccion' });
      }
    } else {
      var nuevoEnSeccion2 = new estTieneSeccModel({
        idSeccion: seccion,
        idEstudiante: estudiante,
        grado: grado
      });
      nuevoEnSeccion2.save((err, nuevoEnSeccionListo2) => {
        if(err) throw err;
        estudianteModel.findById(estudiante, (err, estudianteExist2) => {
          if(err) throw err;
          estudianteExist2.status = true;
          estudianteExist2.save((err, estudianteUpdateStatus2) => {
            if(err) throw err;
            res.json({ code: 200, msg: 'Colocado en la seccion' });
          });
        });
      });
    }
  });
});

router.get('/estudiantes/listar-seccion', (req, res, next) => {
  estTieneSeccModel.find({}).populate('idSeccion').populate('idEstudiante').exec((err, estudiantes) => {
    if(err) throw err;
    if(estudiantes.length > 0) {
      res.json({ code: 200, estudiantes: estudiantes });
    } else {
      res.json({ code: 404, estudiantes: null });
    }
  });
});

router.get('/get-secciones/:grado', (req, res, next) => {
  var grado = req.params.grado;
  seccionModel.find({ grado: grado }, (err, secciones) => {
    if(err) throw err;
    if(secciones.length > 0) {
      estudianteModel.find({ grado: grado }, (err, estudiantes) => {
        if(err) throw err;
        if(estudiantes.length > 0) {
          res.json({ code: 200, secciones: secciones, estudiantes: estudiantes });
        } else {
          res.json({ code: 201, secciones: secciones, estudiantes: null });
        }
      });
    } else {
      estudianteModel.find({ grado: grado }, (err, estudiantes) => {
        if(err) throw err;
        if(estudiantes.length > 0) {
          res.json({ code: 202, secciones: null, estudiantes: estudiantes });
        } else {
          res.json({ code: 404, secciones: null, estudiantes: null });
        }
      });
    }
  });
});


//-------------------ACCIONES DE MATERIA-----------------
router.get('/agregar-materia', (req, res, next) => {
  res.render('admin-crear-materia');
});

router.post('/agregar-materia', (req, res, next) => {
  var codigo = req.body.codigo.trim();
  var nombre = req.body.nombre.trim();
  var grado = req.body.grado.trim();

  materiaModel.findOne({ codigo: codigo }, (err, existMateria) => {
    if(err) throw err;
    if(existMateria) {
      res.json({ code: 402, msg: 'Ya existe una materia registrada con el mismo codigo.' });
    } else { 
      var materia = new materiaModel({
        codigo: codigo,
        nombre: nombre,
        grado: grado
      });

      materia.save((err, nuevaMateria) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Materia registrada!' });
      })
    }
  });
});

router.get('/agregar-materia/buscar', (req, res, next) => {
  materiaModel.find({}, (err, materias) => {
    if(err) throw err;
    if(materias.length > 0) {
      res.json({ materias: materias });
    } else {
      res.json({ materias: null });
    }
  });
});

//----------------ACCIONES DE PROFESOR-------------------
router.get('/listar-profesores', (req, res, next) => {
  res.render('admin-profesores');
});

router.get('/listar-profesores/buscar', (req, res, next) => {
  profesorModel.find({}, (err, profesores) => {
    if(err) throw err;
    if(profesores.length > 0) {
      res.json({ profesores: profesores });
    } else {
      res.json({ profesores: null });
    }
  });
});

router.get('/profesores/:grado', (req, res, next) => {
  var grado = req.params.grado;
  materiaModel.find({ grado: grado }, (err, materias) => {
    if(err) throw err;
    if(materias.length > 0) {
      res.json({ code: 200, materias: materias });
    } else {
      res.json({ code: 404, materias: null });
    }
  });
});
//-----------------ACCIONES DE ALUMNO---------------------
router.get('/listar-alumnos', (req, res, next) => {
  res.render('admin-estudiantes');
});

router.get('/listar-alumnos/buscar', (req, res, next) => {
  estudianteModel.find({}, (err, estudiantes) => {
    if(err) throw err;
    if(estudiantes.length > 0) {
      res.json({ code: 200, estudiantes: estudiantes });
    } else {
      res.json({ code: 404, estudiantes: null });
    }
  });
});

router.get('/pdf-ajuste', (req, res, next) => {
  res.render('ajuste');
});

router.post('/pdf-update', (req, res, next) => {
  var director = req.body.director.trim();
  ajusteModel.findOne({ status: true }, (err, exist) => {
    if(err) throw err;
    if(exist) {
      exist.status = false;
      exist.save((err, existU) => {
        if(err) throw err;
        var ajuste = new ajusteModel({
          director: director
        });
        ajuste.save((err, ajusteNew) => {
          if(err) throw err;
          res.json({ code: 200, msg: 'Director(a) actualizado' });
        });
      });
    } else {
      var ajuste2 = new ajusteModel({
        director: director
      });
      ajuste2.save((err, ajusteNew2) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Director(a) adicionado' });
      });
    }
  });
});

router.get('/pdf-ajuste-getdata', (req, res, next) => {
  ajusteModel.find({}, (err, dirs) => {
    if(err) throw err;
    if(dirs.length > 0) {
      res.json({ code: 200, dirs: dirs });
    } else {
      res.json({ code: 404, dirs: null });
    }
  });
});
module.exports = router;
