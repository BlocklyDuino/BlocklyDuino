var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var exec = require('child_process').exec;

gulp.task('less', function(){
    return less('css/**/*.less')
        .pipe(gulp.dest('css/'));
});

function buildBlocklySection(path){
    watch(path, { 
        ignoreInitial: true
    }, function(f){
        console.log('Change detected in ' + path + ', processing...');
        process.chdir('../blockly');
        exec('python build.py', function(err, stdout, stderr) {
            console.log(stdout);
            if(stderr){
                console.log('ERROR: ', stderr);
            }

            if(err){
                console.log('ERROR: ', error);
            }
            
            console.log('...aaaand we are done!');
        });
        process.chdir('../cyberduino');
    });
}

gulp.task('watch', function(){
    var files = [
        '../blockly/blocks/*.js',
        '../blockly/core/*.js',
        '../blockly/generators/**/*.js',
        '../blockly/msg/messages.js',
        '../blockly/msg/json/*.json'];

    files.forEach(file => buildBlocklySection(file));
});