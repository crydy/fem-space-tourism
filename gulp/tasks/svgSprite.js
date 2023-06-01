import createSvgSprite from 'gulp-svg-sprite';  // svg-sprite creator

// create svg-sprite from files in src/svgicons/
export const svgSprite = () => {
    // get svg files
    return app.gulp.src(app.path.src.svgicons)
    // show error notification in windows
    .pipe(app.plugins.notifyError('SVG Sprite'))
        // create svg sprite
        .pipe(createSvgSprite({
            mode: {
                stack: {
                    sprite: '../icons/icons.svg',
                    // Create the html-page with icons list
                    example: true
                }
            },
        }))
        // place the result here
        .pipe(app.gulp.dest(app.path.build.images))
        // browser reload
        .pipe(app.plugins.browsersync.stream());
}