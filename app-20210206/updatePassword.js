const Auth = require('./model/auth');
const crypto = require('crypto');
const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/data", {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

(async () => {
    let users = await Auth.find({});
    for (let user of users) {
        if (user.password.length == 32) continue;
        let pwd = crypto.createHash('md5').update(user.password).digest('hex');
        await Auth.updateOne({ _id: user._id }, { $set: { password: pwd } })
    }
    console.log('Finish!')
})()