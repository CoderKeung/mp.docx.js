const dealUrl = "/meipian/deal";
const loadGif = '<img src="image/loading.gif" id="loadGif" alt="loading" width="30" height="30">'

$("#mp-submit").click(function(){
  this.innerHTML = loadGif;
  $.ajax({
    type: "POST",
    url: dealUrl,
    data: {url:$("#mp-url").val()},
    dataType: "json",
    success: (data) => {
      $("#mp-submit").text('提交')
      $("#loadGif").remove();
      $("#docx-table").append(`
        <tr>
          <td>${data.title}</td>
          <td><a onclick="clickDownload(this)" href="${data.url}">⬇️<a></td>
        </tr>
        `)
    }
  })
});

function clickDownload(obj) {
  $(obj).text("✅");
}

function isUrl (url) {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
}

$("#mp-url").bind("input propertychange", function(e) {
  var value = $("#mp-url").val();
  if (value == "") {
    $(".mp-input").css("color", "var(--headline)")
  } else if(isUrl(value)) {
    $(".mp-input").css("border", "solid var(--highlight)")
  } else {
    $(".mp-input").css("border", "solid var(--red)")
  }
})
