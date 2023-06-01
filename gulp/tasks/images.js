import webp from 'gulp-webp';           // webp converter
import imagemin from 'gulp-imagemin';   // images minificator

// images converting, minification, copying
export const images = () => {
    // get all the images
    return app.gulp.src(app.path.src.images)
        // show error notification in windows
        .pipe(app.plugins.notifyError('IMAGES'))
        // go on the further processing with the new files only
        .pipe(app.plugins.newer(app.path.build.images))

        // -------- for production mode only: --------
        // create .webp copies
        .pipe(
            app.plugins.if(
                app.isBuild,
                webp()
            )
        )
        // save in destination folder
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.gulp.dest(app.path.build.images)
            )
        )
        // get images again
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.gulp.src(app.path.src.images)
            )
        )                                    
        // go on the further processing with the new files only
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.plugins.newer(app.path.build.images)
            )
        )
        // minify the images
        .pipe(
            app.plugins.if(
                app.isBuild,
                imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    inerlaced: true,
                    optimizationLevel: 3 // 0 to 7
                })
            )
        )
        // -------------------------------------------

        .pipe(app.gulp.dest(app.path.build.images))      // save in destination folder
        .pipe(app.gulp.src(app.path.src.svg))            // get SVGs
        .pipe(app.gulp.dest(app.path.build.images))      // save SVGs in destination folder
        .pipe(app.plugins.browsersync.stream());         // browser reload
}