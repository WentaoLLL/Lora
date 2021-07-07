var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    wie: { type: String },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    time: { type: Date, required: true }
});

const authModel = mongoose.model('auths', authSchema);

module.exports = authModel;