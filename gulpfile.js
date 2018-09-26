var gulp = require('gulp');
const jasmine = require('gulp-jasmine');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
const reporters = require('jasmine-reporters');
var htmlmin = require('gulp-html-minifier');
const cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
 
gulp.task('pack-js', function () {  
  return gulp.src(['js/modernizr.js', 'js/json.js', 'js/script.js'])
    .pipe(concat('bundle.js'))
    .pipe(uglify({
      ie8: false,
    }))
    .pipe(gulp.dest('public/build/js'));
});
 
gulp.task('pack-css', function () { 
  return gulp.src('./css/*.css')
    .pipe(concat('stylesheet.css'))
    .pipe(cssnano({
      discardDuplicates: true,
      discardEmpty: true
    }))
   .pipe(gulp.dest('public/build/css'));
});
// gulp.task('default', ['pack-js', 'pack-css']);

gulp.task('test', function() {
    return gulp.src('./test/test.js')
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter()
        }))
});

gulp.task('uglify', function(cb) {
  pump([
        gulp.src('js/script.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('minify', function() {
  gulp.src('./index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/build'))
});

// gulp.task('cssnano', function() {
//     return gulp.src('./css/*.css')
//         .pipe(cssnano())
//         .pipe(gulp.dest('./dist'));
// });

gulp.task('build', function(callback) {
    runSequence(['browserSync', 'cssnano'],
        callback
    )
})


gulp.task('watch', ['browserSync'], function() {
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('./*.html', browserSync.reload);
    gulp.watch('./js/**/*.js', browserSync.reload);
    gulp.watch('./css/*.css', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
    })
})

gulp.task('default', function(callback) {
    runSequence(['browserSync', 'watch'],
        callback
    )
})