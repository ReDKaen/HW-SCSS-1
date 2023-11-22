const gulp = require("gulp");
const htmlMin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const gulpClean = require("gulp-clean");
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');

const html = () => {
    return gulp.src("./src/*.html")
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'));
}

const scss = () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest("./dist/styles"))
};

const js = () => {
    return gulp.src("./src/scripts/**/*.js")
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./dist/scripts"));
}

const claenDist = () => {
    return gulp.src("./dist", {read: false}).pipe(gulpClean());
}

const watcher = () => {
    gulp.watch("./src/**/*.html", html).on('change', browserSync.reload);
    gulp.watch("./src/styles/**/*.{scss,sass,css}", scss).on("all", browserSync.reload);
    gulp.watch("./src/scripts/**/*.js", js).on('change', browserSync.reload);
};

const server = () => (
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
)

gulp.task("build", gulp.series(claenDist, gulp.parallel(html, scss, js)));

gulp.task("dev", gulp.series(
    gulp.parallel(html, scss, js),
    gulp.parallel(server, watcher)
));
