let gulp     = require('gulp'),
browserSync  = require('browser-sync').create(),
sass         = require('gulp-sass')(require('sass')),
cssmin       = require('gulp-clean-css'),
uglify       = require('gulp-uglify'),
rigger       = require('gulp-rigger'),
fileinclude  = require('gulp-file-include'),
gcmq         = require('gulp-group-css-media-queries');

gulp.task('html_build', function () {
    return gulp.src('src/*.html')
        .pipe(fileinclude())
        .pipe(rigger())
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css_build', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gcmq())
        .pipe(cssmin())
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('js_build', function () {
    return gulp.src('src/js/*.js')
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js_vendor', function () {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('build/js/'));
});

gulp.task('fonts_build', function () {
    return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.stream());
});

gulp.task('img_build', function () {
    return gulp.src('src/img/*.*')
        .pipe(gulp.dest('build/img/'))
        .pipe(browserSync.stream());
});

gulp.task('webServer', function(done) {
    browserSync.init({
        server: "build/"
    });
    gulp.watch('src/**/*.html', { usePolling: true }, gulp.series('html_build'));
    gulp.watch('src/**/*.scss', gulp.series('css_build'));
    gulp.watch('src/**/*.js', gulp.series('js_build'));
    gulp.watch('src/fonts/*.*', gulp.series('fonts_build'));
    gulp.watch('src/img/*.*', gulp.series('img_build'));
    done();
});

gulp.task('default', gulp.series('html_build', 'css_build', 'js_build', 'js_vendor', 'fonts_build', 'img_build', 'webServer'));
