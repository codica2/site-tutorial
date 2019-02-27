var gulp = require("gulp"),
  browserSync = require("browser-sync"),
  minify = require("gulp-minify"),
  babel = require("gulp-babel");

gulp.task("build", function() {
  return gulp
    .src("develop/site-tutorial.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(minify())
    .pipe(gulp.dest("site-tutorial"));
});

gulp.task("start", function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    notify: false
  });
});
