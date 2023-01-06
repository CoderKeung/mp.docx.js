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
  articleJsonData;
  textArray = [];
  imageArray = [];
  paragraphArray = [];
  progress = 0;
  stylesPath = __dirname+"/static/styles.xml";
  docxDir = __dirname+"/../docx";

  constructor(url) {
    this.url = url;
  }

  getImageCount() {
    for (let content of this.articleJsonData.content) {
      if (content.img_url) {
        this.progress = this.progress + 1;
      }
    }
    console.log(this.progress)
  }

  async getMpHtml() {
    const result = await axios.get(this.url);
    return result.data;
  }

  async getArticleJsonData() {
    const html = await this.getMpHtml();
    const $ = cheerio.load(html);
    const strData = findTextAndReturnRemainder(
      $("script").text(),
      "var ARTICLE_DETAIL = ",
      "var detail = ",
    );
    return JSON.parse(strData);
  }
  async setArticleJsonData() {
    await this.getArticleJsonData().then((jsonData)=>{
      this.articleJsonData = jsonData
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
      children: [new TextRun(this.articleJsonData.article.title)],
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
    this.getImageCount();
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
      fs.writeFileSync(`${this.docxDir}/${this.articleJsonData.article.title}.docx`, buffer);
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
