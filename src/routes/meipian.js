var express = require("express");
var router = express.Router()
var MPTODOCX = require("../core")
var mp = new MPTODOCX("")

router.get('/', function(req, res) {
  res.render("pages/meipian")
});
router.post('/deal', async function(req, res, next) {
  mp.url = req.body.url
  await mp.getArticleJsonData().then((jsonData)=>{
  })
  await mp.start()
  next()
},function(req, res) {
});

router.get("/work", function(req, res) {
  res.send(`${mp.progress}`)
})

module.exports = router
