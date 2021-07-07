var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    deviceid: { type: String, require: true },
    wie: { type: String, require: true },
    obj: { type: String, require: true },
    ve: { type: String, require: true },
    ei: { type: String, require: true },
    id: { type: Number, require: true }
});

const deviceModel = mongoose.model('device', deviceSchema);

module.exports = deviceModel;