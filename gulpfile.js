var gulp = require("gulp"),
  browserSync = require("browser-sync"),
  minify = require("gulp-minify"),
  babel = require("gulp-babel");

gulp.task("build", function() {
  return gulp
    .src("src/js/site-tutorial.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(minify())
    .pipe(gulp.dest("example/site-tutorial"))
    .pipe(gulp.dest("src/dist"));
});

gulp.task("start", function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    notify: false
  });
});
