import fileInclude from "gulp-file-include";      // gathering html-blocks (@@media inside index.html)
import webpHtmlNosvg from 'gulp-webp-html-nosvg'; // modified version of the plugin gulp-webp-html

/* webpHtmlNosvg work example:

    // input:
                <img src="/images/catalogImage.jpg">

    // output:
                <picture>
                    <source srcset="/images/catalogImage.webp" type="image/webp">
                    <img src="/images/catalogImage.jpg">
                </picture>

    
    // input:
                <img src="/images/catalogImage.svg">

    // output:
                <img src="/images/catalogImage.svg"></img>
*/ 

// gathering html modules in destination folder
export const html = () => {
    // get all the html files
    return app.gulp.src(app.path.src.html)
        // show error notification in windows
        .pipe(app.plugins.notifyError('HTML'))
        // gather html-blocks (@@media inside index.html)
        .pipe(fileInclude())
        // for production mode only: create <picture> wrapper for using webp where it's possible
        .pipe(
            app.plugins.if(
                app.isBuild, // "true" if production mode
                webpHtmlNosvg()
            )
        )
        // place html files here
        .pipe(app.gulp.dest(app.path.build.html))
        // browser reload
        .pipe(app.plugins.browsersync.stream());
}