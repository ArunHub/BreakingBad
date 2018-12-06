var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence').use(gulp);
var htmlmin = require('gulp-html-minifier');
const cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
var jasmineBrowser = require('gulp-jasmine-browser');
var protractor = require("gulp-protractor").protractor;

//packing js
gulp.task('pack-js', function() {
    return gulp.src(['js/modernizr.js', 'js/smoke-emitter.js', 'js/json.js', 'js/script.js'])
        .pipe(concat('bundle.js'))
        .pipe(uglify({
            ie8: false,
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('e2e', function(done) {
    gulp.src(__dirname + './e2e/')
        .pipe(protractor({
            configFile: './protractor.config.js',
            args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function(e) { throw e })
});

//unit test
gulp.task('jasmine', function() {
    return gulp.src(['test/**/*.js'])
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({ port: 8888 }));
});

//packing css
gulp.task('pack-css', function() {
    return gulp.src('./css/*.css')
        .pipe(concat('stylesheet.css'))
        .pipe(cssnano({
            discardDuplicates: true,
            discardEmpty: true
        }))
        .pipe(gulp.dest('dist/css'));
});

//minify html
gulp.task('minify', function() {
    gulp.src('./index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
});

//copy fonts
gulp.task('fonts', function() {
    gulp.src('./css/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts'))
});

//optimize images
gulp.task('imagemin', () =>
    gulp.src('./images/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist/images'))
);


//build all
gulp.task('build', function(callback) {
    runSequence(['minify', 'imagemin', 'pack-css', 'fonts', 'pack-js'],
        callback
    )
})

//watch all changes
gulp.task('watch', ['browserSync'], function() {
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('./*.html', browserSync.reload);
    gulp.watch('./js/**/*.js', browserSync.reload);
    gulp.watch('./css/*.css', browserSync.reload);
});

//spins the browser for changes
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
    })
})

//default gulp run
gulp.task('default', function(callback) {
    runSequence(['browserSync', 'watch'],
        callback
    )
})