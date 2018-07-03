var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfGradoMatSchema = new Schema({
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Profesor' },
    codigoMateria: { type: String },
    grado: { type: String },
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfGradoMat', ProfGradoMatSchema);