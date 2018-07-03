var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstudianteSchema = new Schema({
    cedula: { type: String },
    nombre: { type: String },
    apellido: { type: String },
    direccion: { type: String },
    email: { type: String },
    password: { type: String },
    telefono: { type: String },
    grado: { type: String, default: '1er' },
    status: { type: Boolean, default: false },
});

module.exports = mongoose.model('Estudiante', EstudianteSchema);