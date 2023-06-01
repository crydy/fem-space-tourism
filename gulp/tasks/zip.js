import zipPlugin from 'gulp-zip';   // zip archiver

// create or renew the archive of project
export const zip = () => {
    
    // the archive name is the root folder name
    const archiveName = app.path.rootFolder;

    // delete previous archive
    app.plugins.del(`./${archiveName}.zip`);

    // get all the files from the build folder
    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
        // show error notification in windows
        .pipe(app.plugins.notifyError('ZIP'))
        // create the archive with the root folder name
        .pipe(zipPlugin(`${archiveName}.zip`))
        // place the archive here
        .pipe(app.gulp.dest('./'));
}