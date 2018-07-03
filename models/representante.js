var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepresentanteSchema = new Schema({
    cedula: { type: String },
    nombre: { type: String },
    apellido: { type: String },
    telefono: { type: String },
    email: { type: String },
    password: { type: String },
    ciHijos: [{ type: Schema.Types.ObjectId, ref: 'Estudiante' }],
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('Representante', RepresentanteSchema);