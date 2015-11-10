var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function(){
  var b = browserify();
  b.transform(reactify); // use the reactify transform
  b.add('./assets/jsx/comments.js');
  return b.bundle()
    .pipe(source('comments.js'))
    .pipe(gulp.dest('./assets/js'));
});
