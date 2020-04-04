var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
var rename = require('gulp-rename');

var source = [ 'src/napster.js' ];

gulp.task('default', function() {
  gulp.watch(source, ['build']);
});

gulp.task('build', function() {
  return pipeline(
    gulp.src(source),
    uglify(),
    rename({ suffix: '.min' }),
    gulp.dest('.')
  );
});
