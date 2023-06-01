import { fastLog, randomInteger } from './utils/functions.js';
import setBrowserWEBPSupportMark from  './utils/webp-support.js';
import { mobileMenu } from  './modules/mobile-menu.js';


// start the code after HTML loading
window.addEventListener('DOMContentLoaded', () => {

    fastLog();

    setBrowserWEBPSupportMark();

    mobileMenu();

    fillThePage();


    function fillThePage() {
        const currentPath = window.location.pathname; // '/index.html'
        const pageName = currentPath.split('/').pop().split('.')[0]; // 'index'
        const dataPath = 'files/data.json';
    
        // for inner pages only
        if (pageName !== 'index') {

            // elements to fill
            const elems = {
                name: document.getElementById('name'),
                image: document.getElementById('image'),
                description: document.getElementById('description'),
                distance: document.getElementById('distance'),
                travel: document.getElementById('travel'),
            }

            // get data from json
            fetchDataForCurrentPage(dataPath, pageName).then(result => {

                let startData = result[0];

                // log(startData);

                Object.entries(elems).forEach(([id, element]) => {

                    // console.log(key, value);

                    if (element) {

                        if (id === 'image') {
                            // add png/webp switch treatment
                            // add alt info
                            element.src = startData.images.png;
                            element.alt = `${startData.name} photo`;
                        } else {
                            element.innerText = startData[id]
                        }
                    }
                });
            })
        };
    
    
        async function fetchDataForCurrentPage(url, pageName) {
            const response = await fetch(url);
            const commonData = await response.json();
            const data = commonData[pageName]
            return data;
        }
    }
});