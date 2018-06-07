var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate');
var _ = require('lodash');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');
var templateCache = require('gulp-angular-templatecache');
var cssmin = require('gulp-clean-css');
var less = require('gulp-less');
var fs = require('fs');
var source = {
    resource:{
        laydate:[
            'styles/laydate/**/*'
        ],
        fonts:[
            'styles/fonts/**/*'
        ],
        images:[
            'styles/images/**/*'
        ]
    },
    css: {
        vendor: [
            "styles/css/font-awesome.css",
            "styles/css/laydate.css",
            "node_modules/angular-ui-grid/ui-grid.css",
            "node_modules/bootstrap/dist/css/bootstrap.min.css"
        ],
        src: [
            "styles/css/global.less",
            "styles/css/**/*.less"
        ],
        app: "styles/css/global.less"
    },
    js: {
        plugins:[
            'js/**/module.js',
            'js/**/!(module)*.js'
        ],
        src: [
            'app/main.js',
            'app/app.js',
            'app/**/module.js',
            'app/**/!(module)*.js'
        ],
        tpl: 'app/**/*.tpl.html'
    }
}

gulp.task('connect', function() {
    connect.server({
        port: 8888
    })
});

gulp.task('js_app_min', function() {
    return streamqueue({objectMode: true},gulp.src(source.js.src),getTemplateStream()) 
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest("build"));
});
gulp.task('js_plugins_min', function() {
    return gulp.src(source.js.plugins)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.plugins.js'))
        .pipe(gulp.dest("build"));
});
var scripts = require('./app.scripts.json');
gulp.task('css_vendor', function() {
    return gulp.src(source.css.vendor)
        .pipe(cssmin())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest("build"))
});
gulp.task('js_vendor', function() {
    _.forIn(scripts.chunks, function(chunkScripts, chunkName) {
        var path = [];
        chunkScripts.forEach(function(script) {
            var scriptFileName = scripts.paths[script];
            if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

                throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
            }
            path.push(scriptFileName);
        });
        gulp.src(path)
            .pipe(concat(chunkName + ".js"))
            .pipe(gulp.dest("build"));
    })
})
gulp.task('copy',function(){
    gulp.src(source.resource.laydate)
        .pipe(gulp.dest('build'));
        gulp.src(source.resource.fonts)
        .pipe(gulp.dest('build/fonts'));
        gulp.src(source.resource.images)
        .pipe(gulp.dest('build/images'));
})
gulp.task('css_min', function() {
    return gulp.src(source.css.app)
        .pipe(less())
        .pipe(cssmin())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build'));
})
gulp.task('watch', function() {
    gulp.watch(source.css.src, ['css_min']);
    gulp.watch(source.js.src, ['js_app_min']);
    gulp.watch(source.js.tpl, ['js_app_min']);
    gulp.watch(source.js.plugins, ['js_plugins_min']);
})

gulp.task('dev', ['js_vendor','css_vendor','css_min', 'js_app_min','js_plugins_min','copy', 'watch', 'connect']);
gulp.task('default', ['dev']);


var getTemplateStream = function() {
    return gulp.src(source.js.tpl)
        .pipe(templateCache({
            root: '/app/',
            templateBody: '$templateCache.put("<%= url %>","<%= contents %>");',
            module: 'app'
        }))
};