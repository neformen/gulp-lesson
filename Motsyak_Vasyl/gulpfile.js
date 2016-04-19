var gulp = require('gulp');    //gulp should be installed globally and locally in project
var gconcat = require('gulp-concat'); // gulp concat for joining files
var cssmin = require('gulp-cssmin'); //css minificator
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin'); //html minificator
var mainBowerFiles = require('main-bower-files'); //read 'main' properties in bower files and create pathes
var filter = require('gulp-filter'); // filter files according to some pattern
var imagemin = require('gulp-imagemin'); // images minification
var browserSync = require('browser-sync').create(); // simple server with livereload possibility

var pth = {
   src: 'src',
   build: 'build'
};




gulp.task('html', function() {
   return gulp.src(pth.src + '/**/*.html')
       .pipe(htmlmin({collapseWhitespace: true}))
       .pipe(gulp.dest(pth.build))
});

gulp.task('sass', function() {
    return gulp.src(mainBowerFiles().concat([pth.src + '/css/*.scss']))
    	.pipe(filter('**/*.scss'))
    	.pipe(gconcat('style.scss'))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(pth.build + '/css'));
});

gulp.task('images', function() {
   return gulp.src(pth.src + '/img/**/*')
       .pipe(imagemin({progressive: true}))
       .pipe(gulp.dest(pth.build + '/img'))
});

gulp.task('watch', ['browser-sync'], function(){
   gulp.watch(pth.src + '/css/*.scss', ['bsync:sass']);
   gulp.watch(pth.src + '/**/*.html', ['bsync:html']);
});


gulp.task('bsync:sass', ['sass'], function(){
   browserSync.reload();
});

gulp.task('bsync:html', ['html'], function(){
   browserSync.reload();
});


// Static server
gulp.task('browser-sync', ['sass', 'html', 'images'], function() {
   browserSync.init({
      server: {
         baseDir: "./build"
      }
   });
});


gulp.task('build', ['sass', 'html', 'images']);

gulp.task('serve', ['browser-sync', 'watch']);