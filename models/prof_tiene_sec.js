var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profHasSecSchema = new Schema({
    idSeccion: { type: Schema.Types.ObjectId, ref: 'Seccion' },
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Profesor' },
    grado: { type: String },
    codigoMateria: { type: String },
    dia: { type: String },
    horaI: { type: Number },
    status: { type: Boolean, default: true },
});

module.exports = mongoose.model('ProfHasSec', profHasSecSchema);