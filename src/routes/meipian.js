var express = require("express");
var router = express.Router()
var MPTODOCX = require("../core")
var mp = new MPTODOCX("")

router.get('/', function(req, res) {
  res.render("pages/meipian")
});
router.post('/deal', async function(req, res) {
  mp.url = req.body.url;
  await mp.start().then(()=>{
    res.download(`./docx/${mp.articleJsonData.article.title}.docx`)
  })
});

module.exports = router
