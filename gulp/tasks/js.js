import webpack from 'webpack-stream';   // run webpack as a stream to conveniently integrate with gulp

// scripts gathering and minimization
export const js = () => {
    // get app.js (sourcemap is "true" for development mode only)
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
        // show error notification in windows
        .pipe(app.plugins.notifyError('JS'))
        // minimize (in production mode only) and rename
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'app.min.js'
            }
        }))
        // save minimizated js in destination folder
        .pipe(app.gulp.dest(app.path.build.js))
        // reload browser
        .pipe(app.plugins.browsersync.stream());
}