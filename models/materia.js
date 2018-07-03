var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MateriaSchema = new Schema({
    codigo: { type: String },
    nombre: { type: String },
    grado: { type: String },
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('Materia', MateriaSchema);