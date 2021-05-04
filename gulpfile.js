const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
var ghtmlSrc = require('gulp-html-src');
const concat = require('gulp-concat'); 
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin'); 
const browserSync = require('browser-sync').create();

// Destination folders
const DIST = 'dist';

// Clean production folder.
gulp.task('clean', function() {
    console.log('"' + DIST + '" folder is empty!');
    return del(DIST);
});


// Compile Sass into CSS.
gulp.task('sass', async function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
});

gulp.task('css', async function() {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(concat('styles.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST + '/css'))
});

gulp.task('copy', async function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest(DIST))
        .pipe(browserSync.stream());
})

// Optimize images.
gulp.task('imagemin', async function() {
    gulp.src('src/assets/*')
        .pipe(imagemin())
        .pipe(gulp.dest(DIST + '/assets'))
});

gulp.task('js', async function() {
    gulp.src([
        './node_modules/jquery/dist/jquery.js', 
        './node_modules/bootstrap/dist/js/bootstrap.js', 
        './node_modules/js-datepicker/dist/datepicker.min.js', 
        'src/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST + '/js'))
});


// Static Server + watching files
gulp.task('serve', gulp.series('copy', 'imagemin', 'sass', 'css', 'js', function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("src/scss/*.scss", gulp.series('sass', 'css'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/css/*.css', gulp.series('css'));
    gulp.watch("src/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve', 'copy', 'imagemin', 'sass', 'css', 'js'));
