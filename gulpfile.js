/* -----------------------------------------------------------------------------------------------------

Need to have installed in Windows:

    For work in common:

        - Visual Studio Code
        - Git (+ bash)

    Necessarily for this build:

        - node.js
        - gulp

--------------------------------------------------------------------------------------------------------

Main terminal commands (scripts in package.json):

    '$ npm i'                      -> (first time) install all devDependencies from package.json

    '$ npm run dev' / '$ gulp'     -> starting gulp development with live server:
    
                                        1. deleting the build folder if exists
                                        2. conversion/copying fonts (woff/woff2 in build folder)
                                        2. fonts:
                                                - otf & .ttf -> woff & woff2 conversion
                                                - creating/updating fonts.scss (@font-face for import to main file style.scss)
                                                  (to update it delete the file manually before!)
                                        3. files, html, scss, js, images -> assemblying/copying/conversion/minification -> build folder
                                        4. starting live server, with watching for file changes (path.js):
                                                - html files in root and deeper
                                                - scss files in src/scss and deeper
                                                - src/js/app.js
                                                - images with extention: jpg, jpeg, png, svg, gif, ico, webp
                                                - files in src/files
                                        X. 'ctrl + c' to finish
                                        ----------------------------------
                                        >> special for this mode:
                                            - scss/js: sourcemaps creation

    '$ npm run prod'               -> reassembling the files in build folder with production mode extensions:

                                        - html:
                                            - creating <picture> wrapper for using webp where it's possible
                                        - css:
                                            - gathering and placing all css-media-queries in the end of style.css
                                            - vendor prefixes auto addition
                                            - adding css rules for using .webp instead of another image formats
                                            - minimizing style file
                                        - js:
                                            - minimization
                                        - images:
                                            - webp copies creation
                                            - minification

    '$ npm run svgSprite'          -> creation svg sprite from .svg files (files inside 'src/svgicons' folder)

    '$ npm run zip'                -> reassembling the files, creation or renewing the archive of project in root project folder

--------------------------------------------------------------------------------------------------------

Version of npm packages which garantee stable work:

    "devDependencies": {
        "browser-sync": "^2.27.10",
        "del": "^6.1.1",
        "gulp": "^4.0.2",
        "gulp-autoprefixer": "^8.0.0",
        "gulp-clean-css": "^4.3.0",
        "gulp-file-include": "^2.3.0",
        "gulp-fonter": "^0.3.0",
        "gulp-group-css-media-queries": "^1.2.2",
        "gulp-if": "^3.0.0",
        "gulp-imagemin": "^8.0.0",
        "gulp-newer": "^1.4.0",
        "gulp-notify": "^4.0.0",
        "gulp-plumber": "^1.2.1",
        "gulp-rename": "^2.0.0",
        "gulp-replace": "^1.1.3",
        "gulp-sass": "^5.1.0",
        "gulp-svg-sprite": "^1.5.0",
        "gulp-ttf2woff2": "^4.0.1",
        "gulp-webp": "^4.0.1",
        "gulp-webp-html-nosvg": "^1.0.9",
        "gulp-webpcss": "^1.1.1",
        "gulp-zip": "^5.1.0",
        "sass": "^1.52.1",
        "webp-converter": "2.2.3",     // this exact version only
        "webpack": "^5.72.1",
        "webpack-stream": "^7.0.0"
    }

----------------------------------------------------------------------------------------------------- */


// main module
import gulp from 'gulp';
// paths import
import { path } from './gulp/config/path.js';
// common plugins import
import { plugins } from './gulp/config/plugins.js';

// transfer data to global scope (for using in modules)
global.app = {
    gulp,
    path,
    plugins,

    // condition flag for tasks (distinction of the development process and the final assembly)
    isBuild: process.argv.includes('--build'), // if includes - it's production mode
    isDev: !process.argv.includes('--build'),  // if not includes - it's development mode
}

// tasks import
import { server } from './gulp/tasks/server.js';
import { html } from './gulp/tasks/html.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { copyFiles } from './gulp/tasks/copyFiles.js';
import { clear } from './gulp/tasks/clear.js';
import { zip } from './gulp/tasks/zip.js';
import { svgSprite } from './gulp/tasks/svgSprite.js';

// file watcher (not watching fonts!)
function watcher() {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.files, copyFiles);
}

// fonts processing sequence (otf & .ttf -> woff & woff2; creating/updating fonts.scss)
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// main tasks
const mainTasks = gulp.series(
    fonts,
    gulp.parallel(copyFiles, html, scss, js, images)
);

// development tasks sequence
const dev = gulp.series(
    clear,
    mainTasks,
    gulp.parallel(watcher, server)
);

// production tasks sequence
const build = gulp.series(clear, mainTasks);

// archive creation sequence
const deployZIP = gulp.series(clear, mainTasks, zip);

// task by default ('gulp' terminal command)
gulp.task('default', dev);

// export tasks for separatly using in package.json scripts ('npm run <task name>')
export {dev, build, svgSprite, deployZIP}