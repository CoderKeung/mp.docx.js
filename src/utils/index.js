const fs = require("fs")
const path = require("path")
function findTextAndReturnRemainder(target, start, end) {
  let result = target.substring(
    target.search(start) + start.length,
    target.search(end)
  );
  result = result.substring(0, result.lastIndexOf(";"));
  return result;
}

function checkHtmlTag(htmlStr) {
  const reg = /<[^>]+>/g;
  return reg.test(htmlStr);
}

function getTextInHtmlTag(str) {
  if (checkHtmlTag(str)) {
    return str.replace(/<[^>]+>/g, "");
  } else {
    return str;
  }
}

function printImageDownloadLog(str) {
  console.log("Now Download: "+str)
}

async function downloadImage(imgUrl) {
  const response = await fetch(imgUrl);
  // printImageDownloadLog(imgUrl);
  const blob = await response.blob();
  return blob.arrayBuffer();
}

function getFileSize(path) {
  return fs.statSync(path).size;
}

function getDocxDir() {
  return path.join(__dirname, "../../docx/");
}

function sizeExChange(limit){
  var size = "";
  if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B"
  }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
    size = (limit/1024).toFixed(2) + "KB"
  }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
    size = (limit/(1024 * 1024)).toFixed(2) + "MB"
  }else{                                            //其他转化成GB
    size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
  }

  var sizeStr = size + "";                        //转成字符串
  var index = sizeStr.indexOf(".");                    //获取小数点处的索引
  var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
  if(dou == "00"){                                //判断后两位是否为00，如果是则删除00               
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size;
}

module.exports = {findTextAndReturnRemainder, checkHtmlTag, getTextInHtmlTag, printImageDownloadLog, downloadImage, getFileSize, getDocxDir, sizeExChange}
