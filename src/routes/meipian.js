var express = require("express");
var router = express.Router()
var MPTODOCX = require("../core")
var mp = new MPTODOCX("")
const utils = require("../utils/index"); 
const path = require("path")

router.get('/', function(req, res) {
  res.render("pages/meipian")
});

router.post('/deal', async function(req, res) {
  mp.url = req.body.url;
  await mp.start().then(()=>{
    const docxUrl = `/${mp.articleJsonData.article.title}.docx`; 
    const docxTitle = mp.articleJsonData.article.title;
    const docxSize = utils.sizeExChange(utils.getFileSize(path.join(utils.getDocxDir(), docxUrl)));
    var data = {
      url: docxUrl,
      title: docxTitle,
      size: docxSize,
    }
    res.send(JSON.stringify(data))
  })
});

module.exports = router
