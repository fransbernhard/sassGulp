/**
 * REQUIREMENTS
 */
// Requiring Gulp
var gulp = require('gulp'),
// Requires the gulp-sass plugin
sass = require('gulp-sass'),
// Prevent gulp from exiting on error
plumber = require('gulp-plumber'),
// Requiring autoprefixer
autoprefixer = require('gulp-autoprefixer'),
// Requiring Sourcemaps
sourcemaps = require('gulp-sourcemaps'),
//Auto refresh browser on file save
browserSync = require('browser-sync'),
// Require merge-stream to output multilple tasks to multiple destinations
merge = require('merge-stream'),
cssmin = require('gulp-cssmin'),
uglify = require('gulp-uglifyjs'),
reload = browserSync.reaload,
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
cache = require('gulp-cache');

// Internal config, folder structure
var paths = {
    style: {
        source: 'app/sass/',
        destination: 'dist/css/',
    },
    script: {
        source: 'app/js/**/*.js',
        //source: ['app/js/classes/*.js', 'app/js/*.js'],
        destination: 'dist/js/',
    }
};

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    //watch files
    var files = [
      './style.css',
      './*.html'
    ];

    //initialize browsersync
    browserSync.init(files, {
        //browsersync with a php server
        proxy: "http://127.0.0.1/sassGulp/",
        notify: false
    });
});

gulp.task('images', function(){
    gulp.src('app/img/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('dist/img/'));
});

gulp.task('js', function() {
    gulp.src(paths.script.source)
      .pipe(uglify('bundle.min.js'))
      .pipe(gulp.dest(paths.script.destination))
      .pipe(browserSync.reload({
            stream: true
        }));
});

try {
    gulp.task('sass', function() {
        return gulp.src(paths.style.source + 'style.scss')
          .pipe(plumber())
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError)) // Initialize sass
          .pipe(autoprefixer()) // Passes it through gulp-autoprefixer
          // .pipe(sourcemaps.write()) // Writing sourcemaps
          .pipe(cssmin().on('error', function(err) {
            console.log(err);
          }))
          .pipe(rename({
            suffix: '.min'
          }))
          .pipe(gulp.dest(paths.style.destination))
          .pipe(browserSync.reload({
              stream: true
          }));
    });
} catch(e) {
    console.log("HEJ JAG ÄR ETT FEL",e.stack);
}

gulp.task('default', ['sass', 'js', 'images', 'browser-sync'], function(){
    gulp.watch(paths.style.source + '**/*.scss', ['sass']);
    gulp.watch(paths.script.source, ['js']);
    gulp.watch('**/*.html', browserSync.reload);
});
