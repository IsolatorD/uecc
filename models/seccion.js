var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeccionSchema = new Schema({
    nombre: { type: String },
    grado: { type: String },
    status: { type: Boolean, default: true },
    full: { type: Boolean, default: false }
});

module.exports = mongoose.model('Seccion', SeccionSchema);