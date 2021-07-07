const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Data = require('../model/data');
const Auth = require('../model/auth');
const Device = require('../model/device');
const crypto = require('crypto');

Auth.findOneAndUpdate({ email: 'admin@gmail.com' }, {
  username: 'admin',
  password: crypto.createHash('md5').update('admin').digest('hex'),
  email: 'admin@gmail.com',
  role: 0,
  time: new Date(),
}, { upsert: true, new: true, setDefaultsOnInsert: true },
  function(error, result) {
    if (error) return;
    console.log({
      username: 'admin',
      password: 'admin',
      email: 'admin@gmail.com',
      time: new Date(),
    })
  })

Auth.findOneAndUpdate({ email: 'admin2@gmail.com' }, {
  username: 'admin2',
  password: crypto.createHash('md5').update('admin2').digest('hex'),
  email: 'admin2@gmail.com', 
  role: 1,
  time: new Date(),
}, { upsert: true, new: true, setDefaultsOnInsert: true },
  function(error, result) {
    if (error) return;
    console.log({
      username: 'admin2',
      password: 'admin2',
      email: 'admin2@gmail.com',
      time: new Date(),
    })
  })


router.get('/', function(req, res, next) {
  return res.render('index');
});

// router.post('/add/admin', async function(req, res) {
//   const { username, password, email, } = req.body
//   result = {};
//   let au = new Auth({
//     username,
//     password,
//     email,
//     time: new Date(),
//   })
//   result.data = au;
//   await au.save();
//   return res.json(result)
// });

router.get('/login', function(req, res) {

  if (req.session.loggedin)
    return res.redirect('/secured/dashboard')
  let err = req.session.error;
  req.session.error = null;
  return res.render('login', { err });
})

router.post('/login', async function(req, res) {
  const { email, password } = req.body;

  let user = await Auth.findOne({ email });
  // console.log(user)
  if (!user) {
    req.session.error = "User dose not exist"
    return res.redirect('login')
  }
  console.log(user.password, crypto.createHash('md5').update(password).digest('hex'))
  if (user.password !== crypto.createHash('md5').update(password).digest('hex')) {
    req.session.error = "Incorrect password"
    return res.redirect('login')
  }

  req.session.loggedin = true;
  req.session.userid = user._id;
  res.redirect('/secured/dashboard');
})





router.post('/api/data/upload', async function(req, res) {
  const { data } = req.body;
  if (!data) {
    return res.status(400).send("Bad request");
  }

  const arr = data.split(",");

  if (arr.length !== 7) {
    return res.status(400).send("Bad data format");
  }

  // if (!mongoose.Types.ObjectId.isValid(arr[0])) {
  //   return res.status(400).send("Bad User ID");
  // }

  // const user = await Auth.findOne({ _id: arr[0] })


  // if (!user) {
  //   return res.status(400).send("User Id not Found");
  // }

  let [wie, obj, ve, ei, type, id, value] = arr;

  // let d = await Date.upsert({ wie, obj, ve, ei, id }, query, {
  //   new: true,
  //   upsert: true // Make this update into an upsert
  // })
  let device = await Device.findOne({ wie, obj, ve, ei, id })
  type = parseInt(type);
  id = parseInt(id);
  value = parseInt(value) / 1000;
  const d = new Data({
    wie, obj, ve, ei, type, id, value, deviceid: device.deviceid,
    time: new Date()
  })
  await d.save();
  return res.json({ ok: true })
})


router.get('/logout', function(req, res) {
  req.session.loggedin = null;
  req.session.userid = null;
  res.redirect('/');
})

module.exports = router;
