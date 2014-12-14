var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

gulp.task('lint', function(cb) {
  gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
  gulp.src('spec/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['lint', 'test']);