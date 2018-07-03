var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    nombre: { type: String },
    apellido: { type: String },
    email: { type: String },
    password: { type: String }
});

module.exports = mongoose.model('Admin', AdminSchema);