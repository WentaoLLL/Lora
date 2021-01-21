const express = require('express');
const router = express.Router();
const Auth = require('../model/auth');
const Data = require('../model/data');
const Feedback = require('../model/feedback');
const Device = require('../model/device');
const pdf = require('html-pdf');
const fs = require('fs');
const ejs = require('ejs');
const _ = require('lodash');

router.get('/dashboard', async function(req, res) {
    console.log(req.session)
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        let users = await Auth.find({ role: 0 }, 'username userid')
        console.log(users)
        obj.users = users
        res.render('data', obj)
    } else {
        res.render('userDashBoard', obj)
    }
});



router.get('/dashboard/data', async function(req, res) {

    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        res.render('data', obj)
    } else {
        res.render('userDashBoard', obj)
    }
});

router.get('/dashboard/data/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        let obj = {};
        obj.user = user;
        obj.id = id;
        res.render('dataDetail', obj)
    } else {
        res.status(401).send('unauthed');
    }
});

router.get('/dashboard/device/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        let obj = {};
        obj.user = user;
        obj.id = id;
        res.render('deviceDetail', obj)
    } else {
        res.status(401).send('unauthed');
    }
});


router.get('/dashboard/users', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        let obj = {};
        obj.user = user;
        obj.id = id;
        res.render('users', obj)
    } else {
        res.status(401).send('unauthed');
    }
});

router.get('/dashboard/user/:id', async function(req, res) {

    const { id } = req.params
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
   
    if (user.role < 2) {
        obj.user = user; 
        obj.id = id;
        res.render('userDetail', obj)
    } else {
        res.render('userDashBoard', obj)
    }
});

router.get('/dashboard/feedbacks', async function(req, res) {

    const { id } = req.params
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
   
    if (user.role < 2) {
        obj.user = user;
        obj.id = id;
        res.render('feedback', obj)
    } else {
        res.render('userDashBoard', obj)
    }
});


router.get('/dashboard/add/user', async function(req, res) {
    // const { userid } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        //  obj.id = userid;
        res.render('addUser', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})

router.get('/dashboard/add/device', async function(req, res) {
    // const { userid } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        //  obj.id = userid;
        res.render('addDevice', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})

router.get('/dashboard/devices', async function(req, res) {
    // const { userid } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        //  obj.id = userid;
        res.render('devices', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})

router.get('/dashboard/device', async function(req, res) {
    // const { userid } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        //  obj.id = userid;
        res.render('deviceDetail', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})

router.get('/dashboard/feedback/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        obj.id = id;
        res.render('feedbackDetail', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})


router.get('/dashboard/updateprice', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        obj.id = id;
        res.render('editPrice', obj)
    } else {
        res.render('userDashBoard', obj)
    }
})


/**
 * 
 * user dashboard
 * 
*/
router.get('/user/dashboard/data/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.id = id;
    obj.user = user;
    res.render('userDataDetail', obj);
})

router.get('/user/dashboard/download', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    let data = await Data.find({ userid: req.session.userid })
    let obj = {};
    obj.user = user;
    obj.data = data;
    // console.log(data);
    res.render('userDownload', obj);
})


/**
 * 
 * apis for ajax request
 * 
*/
router.get('/api/data/:id', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    let obj = {};
    obj.user = user;
    if (user.role < 2) {
        result = {};
        let data = await Data.findOne({ _id: req.params.id }).populate({ path: 'userid' })
        result.data = data;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
});

router.post('/api/data/:id', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        console.log(req.body)
        let data = await Data.findOneAndUpdate({ _id: req.params.id }, req.body)
        console.log(data)
        result.data = true;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
});

router.get('/api/data', async function(req, res) {
    type = ['water', 'electricity', 'gas', 'heat']
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        let data = await Data.find({});
        result.history = data;
        return res.json(result);
    } else {
        res.status(401).send('unauthed');
    }
});

function formatData(label, data) {
    const arry = [];
    label.map(i => {
        if(!data[i]) arry.push(0);
        else arry.push(+data[i].toFixed(3))
    })
    return arry;
}

function getData(item, day, month, year, label_day, label_month, label_year, type) {

    if (!label_day.includes(day)) label_month.push(day)

    if (!label_month.includes(day)) label_month.push(day)
    // bymonth
    if (!obj[day] && Object.keys(obj).length <= 30) {
        obj[day] = item.type == type ? item.value : 0;
    } else if (obj[day]) {
        obj[day] += item.type == type ? item.value : 0;
    }
    
    if (obj2) {
        // byyear
        if (!label_year.includes(month)) label_year.push(month)
        if (!obj2[month] && Object.keys(obj2).length <= 12) {
            obj2[month] = item.type == type ? item.value : 0;
        } else if (obj2[month]) {
            obj2[month] += item.type == type ? item.value : 0;
        }
    }
    return { obj, obj2 }
}

function getFormattedDate(date, type, normal = false) {
    date = new Date(date)
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    if (type == 'day' && !normal) {
        return day + '/' + month + '/' + year;
    } else if (type == 'day' && normal) {
        return year + '-' + month + '-' + day;
    } else if (type == 'month' && !normal) {
        return month + '/' + year;
    } else if (type == 'month' && normal) {
        return year + '-' + month;
    }
}

router.get('/api/users', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        let users = await Auth.find({ role: {$gte:1} })
        let result = {};
        result.data = users;
        res.json(result);
    } else {
        res.status(401).send('unauthed');
    }
});

router.get('/api/users/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        let result = {};
        let u = await Auth.findOne({ _id: id });
        result.data = u;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
});

router.post('/api/users/:id', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        console.log(req.body)
        let data = await Auth.findOneAndUpdate({ _id: req.params.id }, req.body)
        console.log(data)
        result.data = true;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
});

router.post('/api/add/user', async function(req, res) {
    const { username, email, wie, password } = req.body;

    let u = Auth({
        username,
        email,
        password,
        wie,
        role: 2,
        time: new Date()
    })
    try {
        await u.save();
    } catch (error) {
        return res.status(400).send('Bad request');
    }
    return res.json({ ok: true, data: u })
})

router.post('/api/add/device', async function(req, res) {
    let u = Device(req.body)
    try {
        await u.save();
    } catch (error) {
        return res.status(400).send('Bad request');
    }
    return res.json({ ok: true, data: u })
})

router.get('/api/devices', async function(req, res) {

    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        let data = await Device.find({})
        result.data = data;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})

router.get('/api/device/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};

        let data = await Device.findOne({ _id: id })
        result.data = data;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})

router.post('/api/device/:id', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        console.log(req.body)
        let data = await Device.findOneAndUpdate({ _id: req.params.id }, req.body)
        console.log(data)
        result.data = true;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})

router.delete('/api/device/:id', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        console.log(req.body)
        let data = await Device.remove({ _id: req.params.id })
        console.log(data)
        result.data = true;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})

router.get('/api/feedbacks', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        let data = await Feedback.find({}).populate({ path: 'sender' }).sort('-time');
        result.data = data;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})


router.get('/api/feedback/:id', async function(req, res) {
    const { id } = req.params;
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        result = {};
        await Feedback.updateOne({ _id: id }, { read: true });
        let feedback = await Feedback.findOne({ _id: id }).populate({ path: 'sender' }).populate({ path: 'dataid' })
        result.data = feedback;
        res.json(result)
    } else {
        res.status(401).send('unauthed');
    }
})

router.get('/api/price', async function(req, res) {
    let rawdata = fs.readFileSync('./constant.json');
    let constant = JSON.parse(rawdata);
    let user = await Auth.findOne({ _id: req.session.userid });
    if (user.role < 2) {
        res.json(constant);
    } else {
        res.status(401).send('unauthed');
    }
})

router.post('/api/updateprice', async function(req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    console.log(req.body)
    let { water, el, gas, heat } = req.body;
    let data = {
        water: parseFloat(water),
        el: parseFloat(el),
        gas: parseFloat(gas),
        heat: parseFloat(heat)
    }
    if (user.role < 2) {
        let result = {};
        try {
            await fs.writeFileSync('./constant.json', JSON.stringify(data));
            result.ok = true;
            res.json(result);
        } catch (err) {
            console.error(err);
        }
    } else {
        res.status(401).send('unauthed');
    }
})

router.get('/api/user/data/date', async function(req, res) {
    let start = req.query.start;
    let end = req.query.end;
    let user = await Auth.findOne({ _id: req.session.userid });
    const conditions = { wie: user.wie }
    if (start && end) {
        conditions['time'] = { $gte: new Date(start + ' 00:00:00'), $lte: new Date(end + ' 00:00:00') }
    } else if (start) {
        conditions['time'] = { $gte: new Date(start + ' 00:00:00') }
    }
    const ret = await Data.aggregate([
        { $match: conditions },
        { $sort: { time: -1 } },
        {
            $project : {
                type: 1,
                value: 1,
                deviceid: 1,
                day : { $substr: [{"$add":["$time", 28800000]}, 0, 10] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
            }
        },
        {
            $group: {
                _id: {
                    type: "$type",
                    deviceid: "$deviceid",
                    day: "$day",
                },
                value: { $first: "$value" }
            }
        },
        {
            $group: {
                _id: {
                    type: "$_id.type",
                    day: "$_id.day"
                },
                value: { $sum: "$value" }
            }
        },
        { $sort: { '_id.day': -1 } },
    ]).exec();
    const data = ret.map(i => { return { type: i._id.type, day: i._id.day, value: i.value }});

    let result = {};
    let water_day = [];
    let electricity_day = [];
    let gas_day = [];
    let heat_day = [];
    let label_x_day = [...new Set(data.map(i => i.day))].sort();

    label_x_day.map(i => {
        let water = _.find(data, { type: 1, day: i });
        water_day.push((water && water.value.toFixed(3)) || 0)

        let electricity = _.find(data, { type: 2, day: i });
        electricity_day.push((electricity && electricity.value.toFixed(3)) || 0)

        let gas = _.find(data, { type: 3, day: i });
        gas_day.push((gas && gas.value.toFixed(3)) || 0)

        let heat = _.find(data, { type: 4, day: i });
        heat_day.push((heat && heat.value.toFixed(3)) || 0)
    })
    label_x_day = label_x_day.map(i => {
        let t = i.split('-');
        return t[2] + '/' + t[1] + '/' + t[0]
    })

    result['data'] = {
        label_x_day, water_day, electricity_day,gas_day,heat_day
    }
    res.json(result);

})

router.get('/api/user/data', async function (req, res) {
    let user = await Auth.findOne({ _id: req.session.userid });
    let datas = await Data.find({ wie: user.wie }).sort({ time: -1 });

    let result = {};
    result.user = user;
    result.history = datas;

    const ret = await Data.aggregate([
        { $match: { wie: user.wie } },
        { $sort: { time: -1 } },
        {
            $project : {
                type: 1,
                value: 1,
                deviceid: 1,
                day : { $substr: [{"$add":["$time", 28800000]}, 0, 10] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
            }
        },
        {
            $group: {
                _id: {
                    type: "$type",
                    deviceid: "$deviceid",
                    day: "$day",
                },
                value: { $first: "$value" }
            }
        },
        {
            $group: {
                _id: {
                    type: "$_id.type",
                    day: "$_id.day"
                },
                value: { $sum: "$value" }
            }
        },
        { $sort: { '_id.day': -1 } },
    ]).exec();
    const data = ret.map(i => { return { type: i._id.type, day: i._id.day, value: i.value }});

    const water = _.find(data, { type: 1 });
    const water_total = water.value;

    const electricity = _.find(data, { type: 2 });
    const electricity_total = electricity.value;

    const gas = _.find(data, { type: 3 });
    const gas_total = gas.value;

    const heat = _.find(data, { type: 4 });
    const heat_total = heat.value;

    let water_day = [];
    let water_month = [];
    let water_year = [];
    let electricity_day = [];
    let electricity_month = [];
    let electricity_year = [];
    let gas_day = [];
    let gas_month = [];
    let gas_year = [];
    let heat_day = [];
    let heat_month = [];
    let heat_year = [];
    let label_x_day = [...new Set(data.map(i => i.day))].slice(0, 30).sort();
    let label_x_month = [...new Set(data.map(i => i.day.substr(0,7)))].slice(0, 12).sort();
    let label_x_year = [...new Set(data.map(i => i.day.substr(0,4)))].slice(0, 12).sort();

    label_x_day.map(i => {
        let water = _.find(data, { type: 1, day: i });
        water_day.push((water && water.value.toFixed(3)) || 0)

        let electricity = _.find(data, { type: 2, day: i });
        electricity_day.push((electricity && electricity.value.toFixed(3)) || 0)

        let gas = _.find(data, { type: 3, day: i });
        gas_day.push((gas && gas.value.toFixed(3)) || 0)

        let heat = _.find(data, { type: 4, day: i });
        heat_day.push((heat && heat.value.toFixed(3)) || 0)
    })

    label_x_month.map(month => {
        let water = _.find(data, (i) => { return i.type == 1 && (i.day.indexOf(month) > -1)});
        water_month.push((water && water.value.toFixed(3)) || 0)

        let electricity = _.find(data, (i) => { return i.type == 2 && (i.day.indexOf(month) > -1)});
        electricity_month.push((electricity && electricity.value.toFixed(3)) || 0)

        let gas = _.find(data, (i) => { return i.type == 3 && (i.day.indexOf(month) > -1)});
        gas_month.push((gas && gas.value.toFixed(3)) || 0)

        let heat = _.find(data, (i) => { return i.type == 4 && (i.day.indexOf(month) > -1)});
        heat_month.push((heat && heat.value.toFixed(3)) || 0)
    })

    label_x_year.map(year => {
        let water = _.find(data, (i) => { return i.type == 1 && (i.day.indexOf(year) > -1)});
        water_year.push((water && water.value.toFixed(3)) || 0)

        let electricity = _.find(data, (i) => { return i.type == 2 && (i.day.indexOf(year) > -1)});
        electricity_year.push((electricity && electricity.value.toFixed(3)) || 0)

        let gas = _.find(data, (i) => { return i.type == 3 && (i.day.indexOf(year) > -1)});
        gas_year.push((gas && gas.value.toFixed(3)) || 0)

        let heat = _.find(data, (i) => { return i.type == 4 && (i.day.indexOf(year) > -1)});
        heat_year.push((heat && heat.value.toFixed(3)) || 0)
    })
    
    label_x_day = label_x_day.map(i => {
        let t = i.split('-');
        return t[2] + '/' + t[1] + '/' + t[0]
    })

    label_x_month = label_x_month.map(i => {
        let t = i.split('-');
        return t[1] + '/' + t[0]
    })

    const priceStr = await fs.readFileSync('./constant.json', 'utf8');
    const price = JSON.parse(priceStr);
    const labels = {
        Water: price.water,
        Electricity: price.el,
        Gas: price.gas,
        Heat: price.heat,
    };

    result.data = {
        labels,
        water_total: water_total.toFixed(3), water_day, water_month, water_year,
        electricity_total: electricity_total.toFixed(3), electricity_day, electricity_month, electricity_year,
        gas_total: gas_total.toFixed(3), gas_day, gas_month, gas_year,
        heat_total: heat_total.toFixed(3), heat_day, heat_month, heat_year,
        label_x_day, label_x_month, label_x_year,
    }

    res.json(result);
})

router.get('/api/user/data/:id', async function(req, res) {
    result = {};
    let rawdata = await fs.readFileSync('./constant.json');
    let constant = JSON.parse(rawdata);
    console.log(constant)
    let data = await Data.findOne({ _id: req.params.id }).populate({ path: 'userid' })

    result.fees = {
        wfee: data.water * constant.water,
        efee: data.electricity * constant.el,
        gfee: data.gas * constant.gas,
        hfee: data.heat * constant.heat,
    }
    result.data = data;

    console.log(result)
    res.json(result)
})

router.post('/api/user/feedback/:id', async function(req, res) {
    const { dataid, content } = req.body;
    result = {};
    let feedback = Feedback({
        dataid: dataid,
        sender: req.session.userid,
        message: content,
        read: false,
        time: new Date()
    })
    await feedback.save();
    result.data = feedback;
    res.json(result)
})

router.post('/api/user/download', async function(req, res) {
    console.log(req.body)
    const { id } = req.body;
    let rawdata = await fs.readFileSync('./constant.json');
    let price = JSON.parse(rawdata);
    let d = await Data.findOne({ _id: id });
    // const html = fs.readFileSync('./public/template.html', 'utf8');
    const options = { format: 'Letter' };

    let data = Object.assign({}, req.body, { data: d, price });
    ejs.renderFile('./public/template.html', data, {}, function(err, html) {
        if (err)
            console.log(err);
        console.log(html)
        pdf.create(html, options).toStream((err, stream) => {
            if (err) return res.end(err.stack)
            res.setHeader('Content-type', 'application/pdf')
            stream.pipe(res)
        })
    });
})





module.exports = router;
