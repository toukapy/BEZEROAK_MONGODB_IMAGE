var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();
const multer  = require('multer');
const path = require('path');


const mongojs = require('mongojs');
const db = mongojs("mongodb://127.0.0.1:27017/bezeroakdb", ['bezeroak']);

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix +".png")
  }
})

const uploadFilter = function(req, file, cb) {
  var typeArray = file.mimetype.split('/');
  var fileType = typeArray[1];
  if((fileType === 'png' || fileType === 'jpg')){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter,
})

var users = [];

db.bezeroak.find(function(err, userdocs){
  if(err){
    console.log(err)
  }else{
    users = userdocs
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  res.json(users)
  });


router.post("/new", upload.single('avatar'), (req, res) => {
  let userNew = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    //_id: Date.now(),
    email: req.body.email
  }

  if(req.file){
    userNew['avatar'] = req.file.filename;

  }else{
    userNew['avatar'] = 'no-image.png';
  }


  db.bezeroak.insert(userNew, function (err, user){
    if (err){
      res.status(500).json("");
    }else{
      users.push(userNew);
      res.json(user);
    }
  });


});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user._id != req.params.id);
  db.bezeroak.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, user){
    if(err){
      console.log(err)

    }else{
      console.log(req.params.id)
      res.json(user);
    }
  })


});

router.put("/update/:id", (req, res) => {
  let user = users.find(user => user._id === req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  db.bezeroakcd.update({_id: mongojs.ObjectId(req.params.id)},
      {$set: {izena: req.body.izena, abizena:req.body.abizena, email:req.body.email}},
      function(err, user){
        if(err){
          console.log(err)
        }else{
          console.log(user)
        }
      })
  res.json(users);
})

module.exports = router;
