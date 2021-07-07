var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, ref: 'auths' },
    wie: { type: String, require: true },
    obj: { type: String, require: true },
    ve: { type: String, require: true },
    ei: { type: String, require: true },
    type: { type: Number, require: true },
    id: { type: Number, require: true },
    value: { type: Number, require: true },
    deviceid: { type: String, require: true },
    time: { type: Date, required: true },
});

const dataModel = mongoose.model('data', dataSchema);

module.exports = dataModel;