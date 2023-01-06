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
  printImageDownloadLog(imgUrl);
  const blob = await response.blob();
  return blob.arrayBuffer();
}

module.exports = {findTextAndReturnRemainder, checkHtmlTag, getTextInHtmlTag, printImageDownloadLog, downloadImage}
