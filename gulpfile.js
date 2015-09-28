var package = require('./package.json');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var eventStream = require('event-stream');
var zip = require('gulp-zip');

gulp.task('lint', function(cb) {
  gulp.src(['./src/*.js', './spec/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
  gulp.src('spec/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('package', function(cb) {
  var mainSource = gulp.src(['src/*', 'src/node/*'], {base: "src"});
  var packageJson = gulp.src('package.json');

  return eventStream.concat(mainSource, packageJson)
    .pipe(zip('BracketsCommandLineShortcuts.' + package.version + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'test', 'package']);
