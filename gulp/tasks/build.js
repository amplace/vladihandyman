var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    sitemap = require('gulp-sitemap');

gulp.task('preview', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });
});

gulp.task('deleteDocs', function () {
    return del('./docs');
});
gulp.task('optimizeImages', function () {
    return gulp.src(['./app/assets/img/**/*'])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('./docs/assets/img'));
});

gulp.task('usemin', ['deleteDocs', 'styles'], function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [function () {
                return rev()
            }, function () {
                return cssnano()
            }]
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('sitemap', ['usemin'], () => {
    gulp.src('docs/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'https://amplace.co.il/'
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('build', ['deleteDocs', 'optimizeImages', 'usemin', 'sitemap']);
