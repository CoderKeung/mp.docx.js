var express = require("express")
var routes = require("./routes/index")
var path = require("path")
var bodyParser = require("body-parser")

const app = express();

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, "static")))
app.use(express.static(path.join(__dirname, "../docx")))

const PORT = 3000;

app.listen(PORT, async() => {
  console.log(`App is running at http://localhost:${PORT}`)
  routes(app)
})
