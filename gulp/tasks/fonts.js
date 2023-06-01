import fs from 'fs';                     // node.js file system module
import fonter from 'gulp-fonter';        // fonts conversion: otf -> ttf -> woff
import ttf2woff2 from 'gulp-ttf2woff2';  // fonts fonversion: ttf -> woff2

// .otf to .ttf conversion inside the source directory
export const otfToTtf = () => {
    // find all .otf fonts
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        // show error notification in windows
        .pipe(app.plugins.notifyError('FONTS'))
        // convert to .ttf
        .pipe(fonter({
            formats: ['ttf']
        }))
        // save in same folder
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

// .ttf to .woff & .woff2 conversion to build directory
export const ttfToWoff = () => {
    // find all .ttf fonts
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        // show error notification in windows
        .pipe(app.plugins.notifyError('FONTS'))
        // convert to .woff
        .pipe(fonter({
            formats: ['woff']
        }))
        // save in destination folder
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))

        // find all .ttf files again
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        // convert to .woff2
        .pipe(ttf2woff2())
        // save in destination folder
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

// add fonts data to fonts.scss (create the file if it's not exist)
export const fontsStyle = () => {
    // get fonts style file
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // check if fonts files is exist
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // check if fonts style file is exist
            if (!fs.existsSync(fontsFile)) {
                // if don't - create it
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;

                for (let i = 0; i < fontsFiles.length; i++) {
                    
                    // write the fonts info into style file
                    let fontFileName = fontsFiles[i].split('.')[0];

                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        if (fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100;
                        } else if (fontWeight.toLowerCase() === 'Thin') {
                            fontWeight = 100;
                        } else if (fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200;
                        } else if (fontWeight.toLowerCase() === 'Extralight') {
                            fontWeight = 200;
                        } else if (fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300;
                        } else if (fontWeight.toLowerCase() === 'Light') {
                            fontWeight = 300;
                        } else if (fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500;
                        } else if (fontWeight.toLowerCase() === 'Medium') {
                            fontWeight = 500;
                        } else if (fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600;
                        } else if (fontWeight.toLowerCase() === 'Semibold') {
                            fontWeight = 600;
                        } else if (fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700;
                        } else if (fontWeight.toLowerCase() === 'Bold') {
                            fontWeight = 700;
                        } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                            fontWeight = 800;
                        } else if (fontWeight.toLowerCase() === 'Extrabold' || fontWeight.toLowerCase() === 'Heavy') {
                            fontWeight = 800;
                        } else if (fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900;
                        } else if (fontWeight.toLowerCase() === 'Black') {
                            fontWeight = 900;
                        } else {
                            fontWeight = 400;
                        }
                        fs.appendFile(fontsFile, `@font-face {\n\tfont-family: "${fontName}";\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\t}\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }

            } else {
            // if file exists - show the message
            console.log("file scss/fonts.scss is already exist. To update it delete the file!");
            }
        }
    });
  
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
}