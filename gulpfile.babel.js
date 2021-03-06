import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import babel from 'gulp-babel';
import gulpBabelIstanbul from 'gulp-babel-istanbul';
import coveralls from 'gulp-coveralls';
import injectModules from 'gulp-inject-modules';
import nodemon from 'gulp-nodemon';

/**
 *gulp task for transpiling ES6 to ES5
 */
gulp.task('transpile', () =>
  gulp.src(['server/controllers/**.js', 'server/middleware/**.js', 'server/helpers/**.js', 'server/routes/**.js'])
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('server/dist/'))
);

/**
 *default gulp task that runs whenever gulp is called without specifing a task
 */
gulp.task('default', ['transpile', 'coveralls'], () => {
  process.exit();
});

/**
 * Gulp task for running tests Specs
 */
gulp.task('run-test', ['transpile'], () =>
  gulp.src(['server/dist/*Spec.js'])
  .pipe(jasmine())
);

/**
 * gulp task for getting coverage report on tests
 */
gulp.task('coverage', (cb) => {
  gulp.src(['server/controllers/', '/server/helpers/', 'server/middleware/', 'server/routes/, server/models/'])
    .pipe(gulpBabelIstanbul())
    .pipe(injectModules())
    .on('finish', () => {
      gulp.src('server/spec/**.Spec.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmine())
      .pipe(gulpBabelIstanbul.writeReports())
      .pipe(gulpBabelIstanbul.enforceThresholds({ thresholds: { global: 70 } }))
      .on('end', cb);
    });
});

/**
 * gulp task to send coverage reports to coveralls.io
 */
gulp.task('coveralls', ['coverage'], () => {
  if (!process.env.CI) {
    return;
  }
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

/**
 * gulp task to serve the App on localhost
 */
gulp.task('serve', ['transpile'], () =>
  nodemon({
    script: 'nodemon --exec babel-node server.js',
    ext: 'js',
    env: { NODE_ENV: process.env.NODE_ENV }
  })
);
