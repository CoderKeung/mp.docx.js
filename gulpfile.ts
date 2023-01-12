var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var nodemon = require("gulp-nodemon");

let node = (cb) => {
  nodemon({
    script: "src/app.js",
    ext: "js, html, css",
    env: {
      "NODE_ENV": "development",
    },
    ignore: [
      "node_modules/"
    ],
  });
  cb();
}

let server = (cb) => {
  var files = [
    "src/*.*",
    "src/views/**/*.ejs",
    "src/routes/*.js",
    "src/static/*.*",
  ];

  browserSync.init({
    proxy: "http://localhost:3000",
    notify: false,
    port: 4000,
  });
  gulp.watch(files).on("change", reload);
  cb();
}

gulp.task("start", gulp.series(node, server))
