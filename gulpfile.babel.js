'use strict';

const path = {
    build: {
        html: 'build',
        js: 'build/js/',
        css: 'build/css/',
        images: 'build/images/',
        img: 'build/img/',
        fonts: 'build/fonts/',

    },
    src: {
        pug: 'src/templates/*.pug',
        pugDir: 'src/templates',
        js: 'src/js/index.js',
        styleDir: 'src/style/',
        styleLibsDir: 'src/style/libs/',
        style: 'src/style/style.scss',
        images: 'src/images/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    watch: {
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        pug: 'src/templates/**/*.pug',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    clean: '/build/'
};

import gulp from 'gulp';
import watch from 'gulp-watch';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import cssmin from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import concat from 'gulp-concat';
import prefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import connect from 'gulp-connect';
import babel from 'gulp-babel';
import util from 'gulp-util';
import del from 'del';
import rigger from 'gulp-rigger';
import browserSync from 'browser-sync';

const production = !!util.env.production;

// gulp.task('server', () => {
//     return connect.server({
//         port: 1378,
//         livereload: true,
//         root: 'build/'
//     });
// });

gulp.task('server', function () {
    browserSync({
        server: {
           baseDir: './build'
        }
    });

    // gulp.watch("build/css/*.css", ['css']);
    gulp.watch("build/html/*.html").on('change', browserSync.reload);

});

gulp.task('js', () => {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(gulpif(!production, sourcemaps.write()))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest(path.build.js))
        // .pipe(connect.reload());
        .pipe(browserSync.stream());
});

gulp.task('styles', () => {
    return gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(prefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(!production, sourcemaps.write()))
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest(path.build.css))
        // .pipe(connect.reload());
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('pug', () => {
    return gulp.src(path.src.pug)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(path.build.html))
        // .pipe(connect.reload());
        .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));

});

//контентная графика
gulp.task('images', () => {
    return gulp.src(path.src.images)
        .pipe(gulpif(production, imagemin([
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 2}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest(path.build.images))
        // .pipe(connect.reload());
        .pipe(browserSync.stream());
});

//интерфейсная графика
gulp.task('img', () => {
    return gulp.src(path.src.img)
        .pipe(gulpif(production, imagemin([
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 2}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest(path.build.img))
        // .pipe(connect.reload());
        .pipe(browserSync.stream());
});

gulp.task('clean', () => {
    return del([path.clean]);
});

gulp.task('watch', () => {
    gulp.watch(path.watch.pug, gulp.series('pug'));
    gulp.watch(path.watch.style, gulp.series('styles'));
    gulp.watch(path.watch.js, gulp.series('js'));
    gulp.watch(path.watch.images, gulp.series('images'));
    gulp.watch(path.watch.images, gulp.series('img'));
    gulp.watch(path.watch.fonts, gulp.series('fonts'));
});

gulp.task('build',
    gulp.series('clean', gulp.parallel('js', 'styles', 'pug', 'fonts', 'images', 'img'))
);

gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));
