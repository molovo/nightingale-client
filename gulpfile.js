const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

gulp.task('build', () => {
  browserify('src/index.js')
    .transform('uglifyify', {global: true})
    .transform('babelify')
    .bundle()
    .pipe(source('client.js.ecr'))
    .pipe(gulp.dest('../views/'))
})