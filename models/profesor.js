var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesorSchema = new Schema({
    cedula: { type: String },
    nombre: { type: String },
    apellido: { type: String },
    direccion: { type: String },
    telefono: { type: String },
    email: { type: String },
    password: { type: String },
    status: { type: Boolean, default: false }
});

module.exports = mongoose.model('Profesor', ProfesorSchema);