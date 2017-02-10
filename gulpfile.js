var gulp = require('gulp')
    del = require('del')
    svgo = require('gulp-svgo')
    sass = require('gulp-sass')
    clean = require('gulp-clean-css')
    rename = require('gulp-rename')
    concat = require('gulp-concat')
    uglify = require('gulp-uglify')
    imagemin = require('gulp-imagemin')
    runsequence = require('run-sequence')
    injectsvg = require('gulp-inject-svg')
    prefixer = require('gulp-autoprefixer')
    sourcemaps = require('gulp-sourcemaps');

// Minify tasks
gulp.task('min-sass', function () {
  gulp.src('sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(clean())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('min'));
});

gulp.task('min-js', function () {
  gulp.src(['js/base/*.js', 'js/vendor/*.js', 'js/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('min'));
});

gulp.task('min-svg', function () {
  gulp.src('images/*.svg')
    .pipe(svgo());
});

// Individual build tasks
gulp.task('pre-build', function () {
  return del(['docs/!(*CNAME)']);
});

gulp.task('build-img', function() {
  return gulp.src('images/!(*.svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('docs/images/'));
});

gulp.task('build-code', function() {
  return gulp.src(['min/main.min.css', 'min/main.min.js'])
    .pipe(gulp.dest('docs/min/'));
});

gulp.task('build-files', function() {
  return gulp.src('files/*')
    .pipe(gulp.dest('docs/'));
});

gulp.task('build-index', function() {
  return gulp.src('index.html')
    .pipe(injectsvg())
    .pipe(gulp.dest('docs/'));
});

// Full build task
gulp.task('build', function(done) {
  runsequence('pre-build', ['build-img', 'build-code', 'build-files'], 'build-index', function() {
    done();
  });
});

// Watch tasks
gulp.task('default', ['min-js', 'min-sass'], function() {
  gulp.watch('js/**/*.js', ['min-js']);
  gulp.watch('sass/**/*.scss', ['min-sass']);
  gulp.watch('index.html', ['build']);
});
