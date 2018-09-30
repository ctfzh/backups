var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    browserSync = require('browser-sync').create();

//设置各种输入输出文件夹的位置;
var srcImage = 'src/img/*.*',
    dstImage = 'dist/img',
    srcHtml = 'src/html/**/*.html',
    dstHtml = 'dist/html';

//css
gulp.task('myLess', function () {
    gulp.src('src/css/bootstrap.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 8', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss ())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

//把所有html页面扔进dist文件夹(不作处理);
//命令行使用gulp html启用此任务;
gulp.task('html', function() {
    gulp.src(srcHtml)
        .pipe(gulp.dest(dstHtml));
});

//图片压缩任务,支持JPEG、PNG及GIF文件;
//命令行使用gulp jpgmin启用此任务;
gulp.task('imgmin', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: true,//高精度模式
            quality: "high",//图像质量:low, medium, high and veryhigh;
            method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70,//最低质量
            loops: 0,//循环尝试次数, 默认为6;
            progressive: false,//基线优化
            subsample: "default"//子采样:default, disable;
        }),

        pngmin = imageminOptipng({
            optimizationLevel: 4
        });

    gulp.src(srcImage)
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(dstImage));

});

gulp.task('js', function () {
    return gulp.src('src/js/**/*js')
        //.pipe(browserify())
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});
gulp.task('serve',['myLess'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("src/css/**/*.less", ['myLess']);
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch(srcImage, ['imgmin']);
    gulp.watch(srcHtml, ['html']);

    gulp.watch('dist/**/*.*').on('change', browserSync.reload);
});
// gulp.task('serve',['myLess','imgmin','html','js'], function() {
//     browserSync.init({
//         server: "./"
//     });

//     gulp.watch("src/css/**/*.less", ['myLess']);
//     gulp.watch("src/js/**/*.js", ['js']);
//     gulp.watch(srcImage, ['imgmin']);
//     gulp.watch(srcHtml, ['html']);

//     gulp.watch('dist/**/*.*').on('change', browserSync.reload);
// });

gulp.task('default', ['serve']);