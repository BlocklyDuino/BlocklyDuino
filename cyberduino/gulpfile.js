var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var exec = require('child_process').exec;

const BlocklyFiles = [
  '../blockly/blocks/*.js',
  '../blockly/core/*.js',
  '../blockly/generators/**/*.js',
  '../blockly/msg/messages.js',
  '../blockly/msg/json/*.json'];

gulp.task('less', function () {
  return less('css/**/*.less')
    .pipe(gulp.dest('css/'));
});

function pythonizeFiles(path) {
  console.log('Pythonizing files in ', path);
  process.chdir('../blockly');
  exec('python build.py', function (err, stdout, stderr) {
    console.log(stdout);
    if (stderr) {
      console.log('ERROR: ', stderr);
    }

    if (err) {
      console.log('ERROR: ', error);
    }

    console.log('...aaaand we are done!');
  });
  process.chdir('../cyberduino');
}

function watchBlocklySection(path) {
  console.log('Watching file ', path);
  watch(path, {
    ignoreInitial: true
  }, function (f) {
    console.log('Change detected in ' + path + ', processing...');
    pythonizeFiles(path);
  });
}

gulp.task('watch', function () {
  BlocklyFiles.forEach(file => watchBlocklySection(file));
});

gulp.task('trigger', function () {
  BlocklyFiles.forEach(file => pythonizeFiles(file));
})