var gulp = require('gulp');
var jshint = require("gulp-jshint");

gulp.task('lint', function(cb) {
  gulp.src("./src/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task('default', ['lint']);