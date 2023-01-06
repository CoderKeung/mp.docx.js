var meipian = require("./meipian.js")
const routerConf = [
  { path: "/meipian", router: meipian},
]

routes = function (app) {
  app.get("/", (req, res) => {
    res.render("pages/index", {title:"HELLO"})
  })
  routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

module.exports = routes
