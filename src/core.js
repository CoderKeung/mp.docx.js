const docx = require("docx")
const {
  Document,
  Paragraph,
  ImageRun,
  TextRun,
  Packer,
} = docx;
const cheerio = require('cheerio');
const fs = require("fs");
const axios = require("axios");
const utils = require("./utils/index"); 
const {
  findTextAndReturnRemainder,
  getTextInHtmlTag,
  downloadImage,
} = utils;

class MPTODOCX {
  url= "";
  articleJsonData = {content:{},title:{}};
  textArray = [];
  imageArray = [];
  paragraphArray = [];
  progress = 0;
  stylesPath = __dirname+"/static/styles.xml";
  docxDir = __dirname+"/../docx";
  jp = false;

  constructor(url) {
    this.url = url;
  }

  isJP() {
    var tmpUrl = this.url.split('/')
    if (tmpUrl[2] === "www.jianpian.cn") {
      this.jp = true;
    } else {
      this.jp = false;
    }
  }

  async getMpHtml() {
    const result = await axios.get(this.url);
    return result.data;
  }

  async getArticleJsonData() {
    this.isJP();
    const html = await this.getMpHtml();
    const $ = cheerio.load(html);
    var strData = "";
    if (this.jp) {
      strData = findTextAndReturnRemainder(
        $("script").text(),
        "window.__INITIAL_STATE__ =",
        "function",
      );
      return JSON.parse(strData);
    } else {
      strData = findTextAndReturnRemainder(
        $("script").text(),
        "var ARTICLE_DETAIL = ",
        "var detail = ",
      );
      return JSON.parse(strData);
    }
    
  }

  async setArticleJsonData() {
    await this.getArticleJsonData().then((jsonData)=>{
      if (this.jp) {
        this.articleJsonData.content = jsonData.detail.article.content;
        this.articleJsonData.title = jsonData.detail.article.title;
      } else {
        this.articleJsonData.content = jsonData.content;
        this.articleJsonData.title = jsonData.article.title;
      }
    });
  }

  setTextArray() {
    for (let content of this.articleJsonData.content) {
      if (content.text) {
        this.textArray.push(
          new Paragraph({
            children: [new TextRun(getTextInHtmlTag(content.text))],
            style: "GWP",
          })
        );
      }
    }
  }

  createTitle() {
    this.textArray.push(new Paragraph({
      children: [new TextRun(this.articleJsonData.title)],
      style: "GWH",
    }));
  }

  async setImageArray() {
    for (let content of this.articleJsonData.content) {
      if (content.img_url) {
        await downloadImage(content.img_url).then((buffer) => {
          this.progress = this.progress - 1;
          this.imageArray.push(new ImageRun({
            data: buffer,
            transformation: {
              width: 200,
              height: 200,
            },
          }));
        })
      }
    }
  }

  async setParagraphArray() {
    this.createTitle();
    this.setTextArray();
    await this.setImageArray();
    this.paragraphArray = this.textArray.concat(new Paragraph({
      children: this.imageArray,
    }));
  }

  async createDocument() {
    await this.setParagraphArray();
    const docx = new Document({
      externalStyles: fs.readFileSync(this.stylesPath, "utf-8"),
      sections: [{
        properties: {
          page: {
            margin: {
              top: "3cm",
              bottom: "2.5cm",
              right: "2.5cm",
              left: "2.5cm",
            },
          },
        },
        children: this.paragraphArray,
      }],
    });
    await Packer.toBuffer(docx).then((buffer) => {
      if (!fs.existsSync(this.docxDir)) {
        fs.mkdirSync(this.docxDir, {recursive: true})
      }
      fs.writeFileSync(`${this.docxDir}/${this.articleJsonData.title}.docx`, buffer);
    })
  }

  async start() {
    await this.setArticleJsonData();
    await this.createDocument().then(()=>{
      this.clean()
    });
  }

  clean() {
    this.url = "";
    this.textArray = [];
    this.imageArray = [];
    this.progress = 0;
    this.paragraphArray = [];
  }
}

module.exports = MPTODOCX
