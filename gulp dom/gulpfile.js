// 引入gulp
var gulp = require('gulp');             // 基础库
// 引入gulp插件
var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
    webserver = require('gulp-webserver'), // 本地服务器
    less = require('gulp-less'),       //less
    cssmin = require('gulp-minify-css');    //css压缩
    uglify = require('gulp-uglify'), // js压缩
    rename = require('gulp-rename'), // 文件重命名
    imagemin = require('gulp-imagemin'), // 图片压缩
    pngquant = require('imagemin-pngquant'), // 深度压缩
    changed = require('gulp-changed'), // 只操作有过修改的文件    //如果后缀发生变化 需要单独配置 .pipe(changed(dist,{extension:'.js'}))
    concat = require("gulp-concat");    //文件合并

    /*cache = require('gulp-cache'), //缓存
    rev = require('gulp-rev-append'),   //添加版本号
    yargs = require('yargs').argv,  //获取运行gulp命令时附加的命令行参数
    clean = require('gulp-clean'),  //清理文件或文件夹
    replace = require('gulp-replace-task'), //对文件中的字符串进行替换
    browserSync = require('browser-sync'),  //启动静态服务器
    transport = require("gulp-seajs-transport"),    //对seajs的模块进行预处理：添加模块标识
    concat = require("gulp-seajs-concat"),  //seajs模块合并
    uglify = require('gulp-uglify'),    //js压缩混淆
    merge = require('merge-stream'),    //合并多个流
    imagemin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'),    //深度压缩png图片
    htmlmin = require('gulp-htmlmin'),  //压缩html
    cssmin = require('gulp-minify-css'),    //压缩css
    cssver = require('gulp-make-css-url-version'),  //css文件添加版本*/

// webserver
gulp.task('webserver', function() {
    gulp.src( 'dist/' ) // 服务器目录（/代表根目录）
    .pipe(webserver({ // 运行gulp-webserver
        livereload: true, // 启用LiveReload
        open: true, // 服务器启动时自动打开网页
        port:9999
    }));
});

//文件合并
gulp.task('concat', function () {
    gulp.src('src/less/*.less')  // 要合并的文件
    .pipe(concat('libs.css'))  // 合并成libs.js
    .pipe(gulp.dest('dist'));
});

// less
gulp.task('less', function () {
  return gulp.src('src/less/*.less')
    .pipe(changed('dist/css',{extension:'.min.css'}))
    .pipe(less())
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(cssmin()) //压缩
    .pipe(gulp.dest('dist/css'));
});

// js压缩  脚本压缩&重命名
gulp.task('script', function() {
  return gulp.src('src/js/*.js') // 指明源文件路径、并进行文件匹配
    .pipe(changed('dist/js',{extension:'.min.js'})) // 对比文件是否有过改动（此处填写的路径和输出路径保持一致）
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
    .pipe(gulp.dest('dist/js')); // 输出路径
});

//仅把开发环境中的HTML文件，移动至发布环境。
gulp.task('html', function() {
  return gulp.src('src/*.html') // 指明源文件路径、并进行文件匹配
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/')); // 输出路径
});

// 图片压缩(gulp-imagemin) + 深度压缩(imagemin-pngquant)：
gulp.task('images', function() {
    return gulp.src('src/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
        .pipe(changed('dist/images')) // 对比文件是否有过改动（此处填写的路径和输出路径保持一致）
        .pipe(imagemin({
         /*   progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性
            use: [pngquant()], // 使用pngquant插件进行深度压缩,
            optimizationLevel: 1, //类型：Number  默认：3  取值范围：0-7（优化等级）*/

            optimizationLevel: 1, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: false //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images')); // 输出路径
});

// 监听任务
gulp.task('watch',function(){
    gulp.watch( ['src/*/*.*','src/*.html'],['less','html']) // 监听根目录下所有.html文件
});


// 默认任务 实时刷新页面
gulp.task('default',['webserver','watch']);