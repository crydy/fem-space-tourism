import dartSass from 'sass';                                        // distribution of Dart Sass, compiled to pure JavaScript
import gulpSass from 'gulp-sass';                                   // Sass plugin for Gulp
import rename from 'gulp-rename';                                   // files renaming
import cleanCss from 'gulp-clean-css';                              // CSS minimization
import webpcss from 'gulp-webpcss';                                 // additional css rules for using .webp instead of another img formats

/*-----------------------------------------------------------------------

    "gulp-webpcss" work example:

        // input:
                    .test { background-image:url('test.png'); }

        // output:
                    .test { background-image:url('test.png'); }
                    .webp .test { background-image:url('test.webp'); }

-------------------------------------------------------------------------

    "webpcss" requires this function:

    // WEBP support check, 'webp'/'no-webp' class addition to HTML
    export function isWebp() {

        // WEBP support check
        function testWebP(callback) {
            let webP = new Image();
            webP.onload = webP.onerror = function () {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";   
        }
        
        // 'webp'/'no-webp' class addition
        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
        });
    }

-----------------------------------------------------------------------*/

const sass = gulpSass(dartSass);

// Sass to CSS converstion:
export const scss = () => {
    // get style.scss (sourcemap is "true" for development mode only)
    return app.gulp.src(app.path.src.scss, {sourcemaps: app.isDev})
        // show error notification in windows
        .pipe(app.plugins.notifyError('SCSS'))
        // sass -> css (compose and convert)
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        // -------- for production mode only: --------
        // create additional css rule for using .webp
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpcss({
                    webpClass: '.webp',
                    noWebpClass: '.no-webp'
                })
            )
        )
        // save non-minimizated css
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.gulp.dest(app.path.build.css)
            )
        )
        // minimize css
        .pipe(
            app.plugins.if(
                app.isBuild,
                cleanCss()
            )
        )
        // -------------------------------------------
        // rename the file
        .pipe(rename({
            extname: '.min.css'
        }))
        // place the final style file here
        .pipe(app.gulp.dest(app.path.build.css))
        // reload browser
        // .pipe(app.plugins.browsersync.stream()); // why it doesn't work?
        .on('end', () => {
            app.plugins.browsersync.reload();
        })
}