var express = require('express');
var pdfkit = require('pdfkit');
var fs = require('fs');
var router = express.Router();
var seccionModel = require('../models/seccion');
var estudianteModel = require('../models/estudiante');
var representanteModel = require('../models/representante');
var estTieneSeccionModel = require('../models/est_tiene_sec');
var profTieneSecModel = require('../models/prof_tiene_sec');
var notaModel = require('../models/nota');
var ajusteModel = require('../models/ajuste');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('estudiante-dash');
});

router.get('/login', (req, res, next) => {
  res.render('estudiante-login');
});

router.get('/mis-datos', (req, res, next) => {
  res.render('estudiante-mis-datos');
});

router.get('/mis-datos/:id', (req, res, next) => {
  var id = req.params.id;
  estudianteModel.findById(id, (err, estudiante) => {
    if(err) throw err;
    if(estudiante) {
      estTieneSeccionModel.findOne({ idEstudiante: estudiante._id }).populate('idSeccion').exec((err, secc) => {
        if(err) throw err;
        console.log(secc);
        if(secc) {
          res.json({ code: 200, estudiante: estudiante, seccion: secc });
        } else {
          res.json({ code: 200, estudiante: estudiante, seccion: null });
        }
      });
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.put('/update/:id', (req, res, next) => {
  var Id = req.params.id;
  var nombre = req.body.nombre.trim();
  var apellido = req.body.apellido.trim();
  var cedula = req.body.cedula.trim();
  var telefono = req.body.telefono.trim();
  var direccion = req.body.direccion.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  estudianteModel.findById(Id, (err, estudiante) => {
    if(err) throw err;
    if(estudiante) {
      estudiante.nombre = nombre;
      estudiante.apellido = apellido;
      estudiante.cedula = cedula;
      estudiante.telefono = telefono;
      estudiante.direccion = direccion;
      estudiante.email = email;
      estudiante.password = password;

      estudiante.save((err, estudianteActualizado) => {
        if(err) throw err;
        res.json({ code: 200, msg: 'Datos actualizados.', estudiante: estudianteActualizado });
      });
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/has-seccion/:id', (req, res, next) => {
  var id = req.params.id;
  estudianteModel.findById(id, (err, existEst) => {
    if(err) throw err;
    if(existEst) {
      if(existEst.status == true) {
        res.json({ code: 200, msg: 'Has sido asignado a una sección, ya puedes utilizar las nuevas funciones' });
      } else {
        res.json({ code: 402, msg: 'Debes esperar que seas asignado a una sección para utiliar el resto de funciones' });
      }
    } else {
      res.json({ code: 404, msg: 'No encontrado' });
    }
  });
});

router.get('/constancia/:id', (req, res, next) => {
  var estId = req.params.id;
  estudianteModel.findById(estId, (err, estudiante) => {
    if(err) throw err;
    if(estudiante) {
      ajusteModel.findOne({ status: true }, (err, dir) => {
        if(err) throw err;
        if(dir) {
          var dia = new Date().getDate();
          var mes = new Date().getMonth()+1;
          var mesName = null;
          var año = new Date().getFullYear();
          switch(mes) {
            case 1:
              mesName = 'Enero';
              break;
            case 2:
              mesName = 'Febrero';
              break;
            case 3:
              mesName = 'Marzo';
              break;
            case 4:
              mesName = 'Abril';
              break;
            case 5:
              mesName = 'Mayo';
              break;
            case 6:
              mesName = 'Junio';
              break;
            case 7:
              mesName = 'Julio';
              break;
            case 8:
              mesName = 'Agosto';
              break;
            case 9:
              mesName = 'Septiembre';
              break;
            case 10:
              mesName = 'Octubre';
              break;
            case 11:
              mesName = 'Noviembre';
              break;
            case 12:
              mesName = 'Diciembre';
              break;
          }
          var doc = new pdfkit;
          doc.pipe(fs.createWriteStream('./public/constancias/'+estId+'.pdf'));
          doc.image('./public/images/logo.png', 20, 45, {width: 100}).fontSize(18).text('Republica Bolivaria de venezuela', {align: 'center' });
          doc.text('Unidad Educativa Colegio La Cocuiza', {align: 'center' });
          doc.text('Direcciòn de Admision, Control y Evalucaiòn', {align: 'center' });
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('Constancia de Estudio', {align: 'center' });
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.fontSize(16).text('Quien suscribe hace constar por medio de la presente que el estudiante: '+estudiante.nombre+' '+estudiante.apellido+', CI: '+estudiante.cedula+', esta inscrito como alumno regular de esta instituciòn, actualmente cursando el grado: '+estudiante.grado+' Año.', {align: 'justify'});
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('Constancia que se expide a peticiòn de parte interesada, a los '+dia+' dias del mes de '+mesName+' de '+año+'.', { align: 'justify'});
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('______________________', {align: 'center'});
          doc.text('Director(a) ' + dir.director, {align: 'center'});
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.text('    ');
          doc.fontSize(14).text('Nota: Caduca en 90 dias');
          doc.end();
          setTimeout(() => {
            console.log('Doc Creado');
            res.json({ code: 200, msg: 'Documento creado', ruta: '/constancias/'+estId+'.pdf' });
          }, 2000);
        } else {
          res.json({ code: 404, msg: 'not found' });
        }
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  estudianteModel.findOne({ email: email }, (err, existEst) => {
    if(err) throw err;
    if(existEst) {
      if(existEst.password == password) {
        res.json({ code: 200, msg: 'Autenticado correctamente', token: existEst._id, user: existEst });
      } else {
        res.json({ code: 402, msg: 'Contraseña invalida' });
      }
    } else {
      res.json({ code: 404, msg: 'El usuario no existe' });
    }
  });
});

router.get('/register', (req, res, next) => {
  seccionModel.find({}, (err, secciones) => {
    if(err) throw err;
    if(secciones.length > 0) {
      res.render('estudiante-register', { sec: true });
    } else {
      res.render('estudiante-register', { sec: false });
    }
  });
});

router.post('/register', (req, res, next) => {
  var cedula = req.body.cedula.trim();
  var nombre = req.body.nombre.trim();
  var apellido = req.body.apellido.trim();
  var direccion = req.body.direccion.trim();
  var telefono = req.body.telefono.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  var cedulaRep = req.body.cedulaRep.trim();
  var nombreRep = req.body.nombreRep.trim();
  var apellidoRep = req.body.apellidoRep.trim();
  var telefonoRep = req.body.telefonoRep.trim();
  var emailRep = req.body.emailRep.trim();  

  estudianteModel.findOne({ email: email }, (err, existEst) => {
    if(err) throw err;
    if(existEst) {
      res.json({ code: 402, msg: 'Ya existe un usuario registrado con esta dirección de correo' });
    } else {
      estudianteModel.findOne({ cedula: cedula }, (err, existEst2) => {
        if(err) throw err;
        if(existEst2) {
          res.json({ code: 402, msg: 'Ya existe un usuario registrado con este numero de cedula' });
        } else {
          var estudiante = new estudianteModel({
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            telefono: telefono,
            email: email,
            password: password,
          });

          estudiante.save((err, nuevoEstudiante) => {
            if(err) throw err;
            estudCopy = nuevoEstudiante;
            representanteModel.findOne({ email: emailRep }, (err, existRep) => {
              if(err) throw err;
              if(existRep) {
                representanteModel.update({ _id: existRep._id }, { $push: { ciHijos: nuevoEstudiante._id }}, (err, updatedRep) => {
                  if(err) throw err;
                  res.json({ code: 200, msg: 'Registrado correctamente' });
                });
              } else {
                var representante = new representanteModel({
                  cedula: cedulaRep,
                  nombre: nombreRep,
                  apellido: apellidoRep,
                  telefono: telefonoRep,
                  email: emailRep,
                  password: cedulaRep,
                  ciHijos: nuevoEstudiante._id,
                });
                representante.save((err, nuevoRepresentante) => {
                  if(err) throw err;
                  res.json({ code: 200, msg: 'Registrado correctamente'});
                });
              }
            });
          });
        }
      });
    }
  });
});

router.get('/mis-notas', (req, res, next) => {
  res.render('estudiante-mis-notas');
});

router.get('/mis-notas/:id', (req, res, next) => {
  var estId = req.params.id;
  notaModel.find({ idEstudiante: estId }).populate('idSeccion').exec((err, notas) => {
    if(err) throw err;
    if(notas.length > 0) {
      res.json({ code: 200, notas: notas });
    } else {
      res.json({ code: 404, notas: null });
    }
  });
});

router.get('/horarios', (req, res, next) => {
  res.render('estudiante-horario');
});

router.get('/horarios/:id', (req, res, next) => {
  var estId = req.params.id;
  estTieneSeccionModel.findOne({ idEstudiante: estId }, (err, estTi) => {
    if(err) throw err;
    if(estTi) {
      profTieneSecModel.find({ idSeccion: estTi.idSeccion }).populate('idProfesor').exec((err, exists) => {
        if(err) throw err;
        if(exists.length > 0) {
          res.json({ code: 200, mats: exists });
        } else {
          res.json({ code: 404, mats: null });
        }
      });
    } else {
      res.json({ code: 404, msg: 'Not Found' });
    }
  });  
});
module.exports = router;
