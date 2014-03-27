var config = require('./config.json');
var gulp = require('gulp');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var open_browser = require('gulp-open');
var refresh = require('gulp-livereload');

/* Server */

var connect = require('connect');
var connect_livereload = require('connect-livereload');
var lr_port = config.options.livereload.port;
var lr_server = require('tiny-lr')();
var lh_vars = config.env.localhost;
var lh_port = lh_vars.url.port;
var lh_url = lh_vars.url.protocol + '://' + lh_vars.url.domain + ':' + lh_port + '/';

gulp.task('sass', function() {
  gulp.src('demo/source/sass/**/*.scss')
    .pipe(sass({
      loadPath: ['vendor', 'library']
    }))
    .pipe(autoprefixer.apply(undefined, config.options.autoprefixer.browsers))
    .pipe(gulp.dest('demo/build/css'))
    .pipe(refresh(lr_server));
});

gulp.task('usemin', function() {

  gulp.src('demo/source/index.html')
    .pipe(usemin({
      // in this case css will be only concatenated (like css: ['concat']).
    }))
    .pipe(gulp.dest('demo/build'))
    .pipe(refresh(lr_server));
});

gulp.task('img', function() {

  gulp.src('demo/build/img/**/*', {
    read: false
  })
    .pipe(clean({
      force: true
    }));

  gulp.src('demo/source/img/**/*.jpg', {
    base: 'demo/source/img'
  })
    .pipe(gulp.dest('demo/build/img'))
    .pipe(refresh(lr_server));
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
  return gulp.src('demo/build/index.html')
    .pipe(open_browser('', {
      url: lh_url
    }));
});

gulp.task('watch', function() {
  gulp.watch(['demo/source/**/*.html', 'demo/source/js/**/*.js', 'library/**/*.js'], ['usemin']);
  gulp.watch(['demo/source/sass/**/*.scss', 'library/**/*.scss'], ['sass']);
  gulp.watch(['demo/source/img/**/*'], ['img']);
});

gulp.task('build', ['sass', 'usemin', 'img']);

gulp.task('server', ['server_livereload', 'server_connect']);

gulp.task('demo', ['server', 'build', 'watch', 'open']);

gulp.task('default', ['demo']);