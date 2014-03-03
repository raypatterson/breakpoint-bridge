var config = require('./config.json');
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var sass = require('gulp-ruby-sass');

var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var bytediff = require('gulp-bytediff');
var minify_html = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var minify_css = require('gulp-csso');
var jshint = require('gulp-jshint');
var minify_js = require('gulp-uglify');
var refresh = require('gulp-livereload');
var open_browser = require('gulp-open');

/* Server */

var connect = require('connect');
var connect_livereload = require('connect-livereload');
var lr_port = config.options.livereload.port;
var lr_server = require('tiny-lr')();
var lh_vars = config.env.localhost;
var lh_port = lh_vars.url.port;
var lh_url = lh_vars.url.protocol + '://' + lh_vars.url.domain + ':' + lh_port + '/';

// gulp.task('html', function() {

//   var stream = gulp.src(source_html);

//   return stream
//     .pipe(production_stream(stream, minify_html()))
//     .pipe(gulp.dest(build_dir))
//     .pipe(refresh(lr_server));
// });

// gulp.task('sass', function() {

//   gulp.src(source_scss)
//     .pipe(sass({
//       errLogToConsole: true,
//       compass: true,
//       loadPath: [source_base]
//     }))
//     .pipe(autoprefixer.apply(undefined, config.options.autoprefixer.browsers))
//     .pipe(size({
//       showFiles: true
//     }))
//     .pipe(gulpif(production, minify_css()))
//     .pipe(gulpif(production, size({
//       showFiles: true
//     })))
//     .pipe(gulp.dest(build_dir))
//     .pipe(refresh(lr_server));
// });

// gulp.task('js', function() {

//   var stream = gulp.src(source_js)
//     .pipe(jshint())
//     .pipe(jshint.reporter());

//   return stream
//     .pipe(production_stream(stream, minify_js()))
//     .pipe(gulp.dest(build_dir))
//     .pipe(refresh(lr_server));
// });

// gulp.task('open_browser', function() {
//   return gulp.src('./demo/build/index.html')
//     .pipe(open_browser('', {
//       url: lh_url
//     }));
// });

// gulp.task('watch', function() {
//   gulp.watch(watch_html, 'html');
//   gulp.watch(watch_scss, 'sass');
//   gulp.watch(watch_js, 'js');
// });

gulp.task('usemin', function() {
  gulp.src('demo/source/index.html')
    .pipe(usemin({
      // in this case css will be only concatenated (like css: ['concat']).
    }))
    .pipe(gulp.dest('demo/build'));
});

gulp.task('sass', function() {
  gulp.src('demo/source/sass/**/*.scss')
    .pipe(sass({
      trace: true,
      loadPath: ['vendor', 'library']
    }))
    .pipe(gulp.dest('demo/build/css'));
});

gulp.task('server_livereload', function() {
  lr_server.listen(lr_port, function(err) {
    if (err) return gutil.log(err);
  });
});

gulp.task('server_connect', function() {
  connect()
    .use(connect_livereload({
      port: lr_port
    }))
    .use(connect.static('demo/build'))
    .listen(lh_port);
});

gulp.task('open', function() {
  return gulp.src('./demo/build/index.html')
    .pipe(open_browser('', {
      url: lh_url
    }));
});

gulp.task('build', ['sass', 'usemin']);

gulp.task('server', ['server_livereload', 'server_connect']);

gulp.task('demo', ['build', 'server', 'open']);