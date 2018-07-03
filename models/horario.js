var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorarioSchema = new Schema({
    idSeccion: { type: Schema.Types.ObjectId, ref: 'Seccion' },
    grado: { type: String },
    materia: { type: String },
    horaI: { type: Number },
    horaF: { type: Number } 
});

module.exports = mongoose.model('Horario', HorarioSchema);