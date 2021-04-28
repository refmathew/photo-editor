const gulp = require("gulp");
const { src, dest, watch, series } = require("gulp");
// const jade = require("gulp-jade");
const sass = require("gulp-sass");
// const autoprefixer = require("gulp-autoprefixer");
// const cssnano = require("cssnano");
const terser = require("gulp-terser");
// const postcss = require("gulp-postcss");
const browserSync = require("browser-sync").create();

//compile sass into css
function sassTask() {
  // where sass file is
  return (
    src("src/sass**/*.sass", { sourcemaps: true })
      // pass into sass compiler
      .pipe(sass())
      // minify css
      // .pipe(postcss([cssnano()]))
      // where to save
      .pipe(gulp.dest("dist", { sourcemaps: "." }))
  );
}

// js minifier
function jsTask() {
  return src("src/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: true }));
}

function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// watch
function watchTask(params) {
  watch("dist/*.html", browserSyncReload);
  watch(
    ["src/js/**/*.js", "src/sass/**/*.sass"],
    series(sassTask, jsTask, browserSyncReload)
  );
}

// default gulp tasks
exports.default = series(sassTask, jsTask, browserSyncServe, watchTask);
