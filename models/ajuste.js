var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AjusteSchema = new Schema({
    director: { type: String },
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('Ajuste', AjusteSchema);