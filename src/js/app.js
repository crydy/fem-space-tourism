import { fastLog } from './utils/functions.js';
import setBrowserWEBPSupportMark from  './utils/webp-support.js';
import { mobileMenu } from  './modules/mobile-menu.js';

const jsonDataPath = 'files/data.json';


// create GULP tasks to separaterly manage data.json
// menate errors in fetch API and webp-check function


// start the code after HTML loading
window.addEventListener('DOMContentLoaded', () => {

    fastLog();

    setBrowserWEBPSupportMark() // set class 'webp' or 'no-webp' to html
        .then(webpSupport => fillThePage(webpSupport));

    mobileMenu();



    function fillThePage(webpSupport) {
        const currentPath = window.location.pathname; // '/index.html'
        const pageName = currentPath.split('/').pop().split('.')[0]; // 'index'
        
        const targetElements = document.querySelectorAll('[data-js-fill]');
        let thisPageData;
        
        if (pageName !== 'index') {
            
            switch (pageName) {
                
                case 'destination':
                    manageChoosePlanetButtons();
                    break;

                case 'crew':
                    break;

                case 'technology':
                    break;
            }

            // get data from json
            fetchDataForCurrentPage(jsonDataPath, pageName).then(data => {
                // keep extracted data
                thisPageData = data;
                // initial data to insert
                let InitialData = thisPageData[0];
                // insert the data
                populateTargetElements(InitialData);
            })
        };


        async function fetchDataForCurrentPage(url, pageName) {
            const response = await fetch(url);
            const commonData = await response.json();
            const data = commonData[pageName]
            return data;
        }

        function manageChoosePlanetButtons() {
            // work with form and radiobutton-labels which is kind of buttons as design result
            const form = document.querySelector('.destination__buttonsblock');

            let isTabNavigation = false;
    
            // manage mouse clicks
            form.addEventListener('mouseup', event => {

                // do not handle right click or click past the button (lable)
                if ( event.button === 2 || event.target.tagName !== 'LABEL') return;

                // get planet name from attribute 'for'
                const requiredName = event.target.htmlFor;

                // find subdata with the same planet name
                const relevantData = thisPageData
                    .find(subdata => subdata.name === requiredName);

                // insert new data
                populateTargetElements(relevantData);
            })
    
            // manage arrows keydown switching
            form.addEventListener('keydown', event => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {

                    // show arrows
                    isTabNavigation = true;

                    // an issue: event.target return previous active radiobutton,
                    // not current one - thus use short delay here
                    // and new request for target button instead of get it from event
                    setTimeout(() => {
                        const targetButton = form.querySelector(
                            `input[type='radio']:checked + label`
                        )

                        // get planet name
                        const requiredName = targetButton.htmlFor;

                         // find subdata with the same planet name
                        const relevantData = thisPageData
                        .find(subdata => subdata.name === requiredName);

                        // isert the data
                        populateTargetElements(relevantData);
                    }, 10)
                }
            })

            // display arrows around buttons block with tab navigation only
            form.addEventListener('focusin', (event) => {
                if (isTabNavigation) {
                    event.currentTarget.firstElementChild.classList.add('tab-navigation');
                } else {
                    event.currentTarget.firstElementChild.classList.remove('tab-navigation');
                }
            });

            // keep tab navigation state
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') isTabNavigation = true;
            });
            document.addEventListener('mousedown', () => {
                isTabNavigation = false;
            });
        }

        function populateTargetElements(relevantData) {

            targetElements.forEach((element) => {
                    
                if (element.id === 'image') {
                    // choose image extention
                    const imgExtention = webpSupport ? 'webp' : 'png';
                    element.src = relevantData.images[imgExtention];
                    // set alt
                    element.alt = `${relevantData.name} photo`;
                } else {
                    element.innerText = relevantData[element.id];
                }

            })
        }
    }
});