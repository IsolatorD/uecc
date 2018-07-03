var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstHasSecSchema = new Schema({
    idSeccion: { type: Schema.Types.ObjectId, ref: 'Seccion' },
    idEstudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante' },
    grado: { type: String },
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('EstHasSec', EstHasSecSchema);