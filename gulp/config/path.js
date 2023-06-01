// get project folder name
import * as nodePath from 'path';                               // node.js built-in module
const rootFolderName = nodePath.basename(nodePath.resolve());   // getting the root catalog name

// main folders
const buildFolder = './dist';
const srcFolder = './src';

// all the paths
// ** -> any nesting level
// *.* -> any files: any name & any extention
export const path = {
    src: {
        html: `${srcFolder}/*.html`,
        html: [ `${srcFolder}/*.html`, `${srcFolder}/html/*.html` ],
        scss: `${srcFolder}/scss/style.scss`,
        js: `${srcFolder}/js/app.js`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        svgicons: `${srcFolder}/svgicons/*.svg`,
        files: `${srcFolder}/files/**/*.*`,
    },
    build: {
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        js: `${buildFolder}/js/`,
        images: `${buildFolder}/img/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
    },
    watch: {
        html: `${srcFolder}/**/*.html`,
        scss: `${srcFolder}/scss/**/*.scss`,
        js: `${srcFolder}/js/**/*.js`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
        files: `${srcFolder}/files/**/*.*`,
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolderName,
}