var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var include = require('gulp-include');

var source = [ 'src/napster.js' ];

gulp.task('default', function() {
  gulp.watch(source, ['build']);
});

gulp.task('build', function() {
  gulp.src(source)
      .pipe(include())
        .on('error', console.log)
      .pipe(uglify('napster.min.js'))
      .pipe(gulp.dest('.'));
});
