const gulp = require('gulp')
const watch = require('gulp-watch')
const gutil = require('gulp-util')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const prettify = require('postcss-prettify')
const cssNext = require('postcss-cssnext')
const nested = require('postcss-nested')
const flexfixes = require('postcss-flexbugs-fixes')
const atImport = require('postcss-import')
const sourcemaps = require('gulp-sourcemaps')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const { reload } = browserSync

const errorHandler = (error) => {
  gutil.log([
    (`${error.name} in ${error.plugin}`).bold.red,
    '',
    error.message,
    ''
  ].join('\n'))

  if (gutil.env.beep) {
    gutil.beep()
  }
}


gulp.task('watch', () => {
  global.watch = true
  watch(`./postcss/**/*.css`, () => {
    runSequence('css', reload.bind(null, `./css/index.css`))
  })
  watch(['./**/*.{html,png,svg,jpeg}', '!./node_modules/**/*', '!./bower_components/**/*'])
})


gulp.task('livereload', () => {
  browserSync.init({
    files: [{
      match: [`./**/*.{html,css,png,svg,jpeg}`],
    }],
    open: 'local',
    reloadOnRestart: true,
    port: gutil.env.port || 3000,
    server: {
      baseDir: `./`,
      index: "index.html",
      directory: false
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    tunnel: !!gutil.env.tunnel
  })
})

gulp.task('css', () => {
  const plugins = [
    atImport(),
    cssNext({
      browsers: ['last 2 versions']
    }),
    nested(),
    flexfixes(),
    prettify()
  ]
  return gulp
    .src(`./postcss/index.css`)
    .pipe(plumber({
      errorHandler
    }))
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
})


gulp.task('default', () => {
  runSequence(
    'css',
    'livereload',
    'watch'
  );
});

gulp.task('minify:css', () => gulp
  .src('./css/index.css')
  .pipe(cleanCSS({ debug: false }))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./css'))
)