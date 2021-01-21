var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedBackSchema = new Schema({
    dataid: { type: Schema.Types.ObjectId, ref: 'data' },
    sender: { type: Schema.Types.ObjectId, ref: 'auths' },
    message: { type: String, required: true },
    read: { type: Boolean, required: true },
    time: { type: Date, required: true }
});

const dataModel = mongoose.model('feedBack', feedBackSchema);

module.exports = dataModel;