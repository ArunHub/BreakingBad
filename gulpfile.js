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
var Server = require('karma').Server;
var del = require('del');

const server = browserSync.create();
const clean = () => del(['dist']);
const paths = {
    scripts: {
        src: './js/**/*.js',
        buildOrder: ['js/modernizr.js', 'js/smoke-emitter.js', 'js/json.js', 'js/script.js'],
        dest: 'dist/js'
    },
    styles: {
        src: './css/*.css',
        dest: 'dist/css'
    },
    html: {
        src: './*.html',
        dest: 'dist/'
    }
};
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

//packing js
function scripts() {
    return gulp.src(paths.scripts.buildOrder, { sourcemaps: true })
        .pipe(uglify({
            ie8: false,
        }))
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
};

function jasmine() {
    return gulp.src(['test/**/*.js'])
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({ port: 8888 }));
}

gulp.task('e2e', function (done) {
    gulp.src(__dirname + './e2e/')
        .pipe(protractor({
            configFile: './protractor.config.js',
            args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function (e) { throw e })
});

//unit test
gulp.task('jasmine', jasmine);

//packing css
gulp.task('pack-css', function () {
    return gulp.src(paths.styles.src)
        .pipe(concat('stylesheet.css'))
        .pipe(cssnano({
            discardDuplicates: true,
            discardEmpty: true
        }))
        .pipe(gulp.dest(paths.styles.dest));
});

function styles() {
    return gulp.src(paths.styles.src)
    .pipe(concat('stylesheet.css'))
    .pipe(cssnano({
        discardDuplicates: true,
        discardEmpty: true
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

//minify html
gulp.task('minify', function () {
    gulp.src('./index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
});

function minifyHtml() {
    return gulp.src('./index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
}

//copy fonts
gulp.task('fonts', function () {
    gulp.src('./css/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts'))
});

function copyFonts() {
   return gulp.src('./css/fonts/*')
    .pipe(gulp.dest('./dist/css/fonts'))
}

//optimize images
gulp.task('imagemin', () =>
    gulp.src('./images/*')
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest('dist/images'))
);

function minifyImages() {
    return gulp.src('./images/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist/images'))
}


//build all
// gulp.task('build', function (callback) {
//     runSequence(['minify', 'imagemin', 'pack-css', 'fonts', 'pack-js'],
//         callback
//     )
// })

gulp.task('build', gulp.series([clean, minifyHtml, minifyImages, styles, copyFonts, scripts]))


function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: './'
        }
    });
    done();
}

//watch all changes
const watch = () => gulp.watch([paths.html.src, paths.scripts.src, paths.styles.src], gulp.series(reload));

gulp.task('default', gulp.series(serve, watch));

/**
 * Reference: 
 * https://github.com/gulpjs/gulp/blob/master/docs/recipes/minimal-browsersync-setup-with-gulp4.md
 * https://css-tricks.com/combine-webpack-gulp-4/
 * https://www.joezimjs.com/javascript/complete-guide-upgrading-gulp-4/
 */
