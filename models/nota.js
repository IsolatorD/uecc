var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotaSchema = new Schema({
    materia: { type: String },
    idEstudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante' },
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Profesor' },
    idSeccion: { type: Schema.Types.ObjectId, ref: 'Seccion' },
    grado: { type: String },
    lapso: { type: String },
    nota: { type: Number }
});

module.exports = mongoose.model('Nota', NotaSchema);