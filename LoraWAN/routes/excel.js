const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const xlsx = require('node-xlsx')
const multer = require('multer')
const Auth = require('../model/auth');
const Data = require('../model/data');
const Device = require('../model/device');

let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/excel');
        },
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            var changedName = (new Date().getTime()) + "." + fileFormat[fileFormat.length - 1];
            cb(null, changedName);
        }
    })
});

function handleExcelDate(numb, format) {
    const time = new Date((numb - 1) * 24 * 3600000 + 1);
    time.setYear(time.getFullYear() - 70);
    time.setHours(time.getHours() - 8);
    const year = time.getFullYear() + '';
    const month = time.getMonth() + 1 + '';
    const date = time.getDate() - 1 + '';
    const hours = time.getHours().toLocaleString();
    const minutes = time.getMinutes();
    if (format && format.length === 1) {
        return year + format + month + format + date + ' ' + hours + ':' + minutes;
    }
    return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date);
}


// 导出管理端Auth表的数据
router.get('/admin/excel/auths', async function (req, res) {

    const list = await Auth.find({}).exec();
    // 表配置
    let excel_config = [];
    // 表头格式
    excel_config.push(['username', 'email', 'password', 'role', 'time']);
    // 表格数据
    list.forEach(item => {
        let _data = [item['username'], item['email'], item['password'], item['role'], item['time']];
        excel_config.push(_data)
    });
    let buffer = xlsx.build([
        {
            name: 'sheet1',
            data: excel_config
        }
    ]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "auths.xlsx");
    res.send(buffer)
})

// 导入管理端Auth表的数据
router.post('/admin/excel/import/auths', upload.single('file'), async (req, res) => {
    const { filename } = res.req.file
    // 获取文件数据
    var list = xlsx.parse("./public/excel/" + filename);

    // 数据处理
    const table_data = list[0].data;

    if (table_data.length > 1) {
        let data = [];
        for (let i = 1; i < table_data.length; i++) {
            const item = table_data[i];
            let query = {
                username: item[0],
                email: item[1],
                password: item[2],
                role: Number(item[3]),
                time: item[4]
            }
            data.push(query)
        };
        // 插入数据
        const res_data = await Auth.insertMany(data).catch(e => {
            res.status(200).json({
                code: 201,
                msg: '数据重复',
                data: null
            })
        });

        if (res_data) {
            res.status(200).json({
                code: 200,
                msg: 'ok',
                data: res_data
            })
        }

    } else {
        res.status(200).json({
            code: 201,
            msg: '上传的excel文件没有数据！',
            data: null
        })
    }
})


// 导出管理端Data表的数据
router.get('/admin/excel/datas', async function (req, res) {

    const { wie, userid } = req.query;

    let list = [];
    if (userid) {
        list = await Data.find({ wie, userid }).exec();
    } else {
        list = await Data.find({ wie }).exec();
    }

    // 表配置
    let excel_config = [];
    // 表头格式
    excel_config.push(['wie', 'obj', 've', 'ei', 'type', 'id', 'value', 'deviceid', 'time']);
    // 表格数据
    list.forEach(item => {
        let _data = [item['wie'], item['obj'], item['ve'], item['ei'], item['type'], item['id'], item['value'], item['deviceid'], item['time']];
        excel_config.push(_data)
    });
    let buffer = xlsx.build([
        {
            name: 'sheet1',
            data: excel_config
        }
    ]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "datas.xlsx");
    res.send(buffer)
})

// 导入管理端Data表的数据
router.post('/admin/excel/import/datas', upload.single('file'), async (req, res) => {
    const { filename } = res.req.file
    // 获取文件数据
    var list = xlsx.parse("./public/excel/" + filename);

    // 数据处理
    const table_data = list[0].data;

    if (table_data.length > 1) {
        let data = [];
        for (let i = 1; i < table_data.length; i++) {
            const item = table_data[i];
            let query = {
                userid: mongoose.Types.ObjectId(),
                wie: item[0],
                obj: item[1],
                ve: item[2],
                ei: item[3],
                type: Number(item[4]),
                id:Number(item[5]),
                value: Number(item[6]),
                deviceid: item[7],
                time: item[8],
            }
            data.push(query)
        };
        // 插入数据
        const res_data = await Data.insertMany(data).catch(e => {
            res.status(200).json({
                code: 201,
                msg: '数据重复',
                data: null,
                system_msg: e
            })
        });

        if (res_data) {
            res.status(200).json({
                code: 200,
                msg: 'ok',
                data: res_data
            })
        }

    } else {
        res.status(200).json({
            code: 201,
            msg: '上传的excel文件没有数据！',
            data: null
        })
    }
})

// 导出管理端devices表的数据
router.get('/admin/excel/devices', async function (req, res) {

    const list = await Device.find({}).exec();
    // 表配置
    let excel_config = [];
    // 表头格式
    excel_config.push(['deviceid', 'wie', 'obj', 've', 'ei', 'id']);
    // 表格数据
    list.forEach(item => {
        let _data = [item['deviceid'], item['wie'], item['obj'], item['ve'], item['ei'], item['id']];
        excel_config.push(_data)
    });
    let buffer = xlsx.build([
        {
            name: 'sheet1',
            data: excel_config
        }
    ]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "devices.xlsx");
    res.send(buffer)
})

// 导入管理端devices表的数据
router.post('/admin/excel/import/devices', upload.single('file'), async (req, res) => {
    const { filename } = res.req.file
    // 获取文件数据
    var list = xlsx.parse("./public/excel/" + filename);

    // 数据处理
    const table_data = list[0].data;

    if (table_data.length > 1) {
        let data = [];
        for (let i = 1; i < table_data.length; i++) {
            const item = table_data[i];
            let query = {
                deviceid: item[0],
                wie: item[1],
                obj: item[2],
                ve: item[3],
                ei: item[4],
                id: Number(item[5])
            }
            data.push(query)
        };
        // 插入数据
        const res_data = await Device.insertMany(data).catch(e => {
            res.status(200).json({
                code: 201,
                msg: '数据重复',
                data: null,
                system_msg: e
            })
        });

        if (res_data) {
            res.status(200).json({
                code: 200,
                msg: 'ok',
                data: res_data
            })
        }

    } else {
        res.status(200).json({
            code: 201,
            msg: '上传的excel文件没有数据！',
            data: null
        })
    }
})


module.exports = router;
