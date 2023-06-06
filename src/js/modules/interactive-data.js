import {
    createStarsLayout,
    createMovingStars
} from "./moving-stars.js";

import { isDesktopMode } from "../utils/functions.js";

export default function fillPage(
    jsonDataPath,
    webpSupport,
    crewSlideInterval,
    crewSlideDelay
) {
    const currentPath = window.location.pathname; // '/index.html'
    const pageName = currentPath.split('/').pop().split('.')[0]; // 'index'
    
    const targetElements = document.querySelectorAll('[data-js-fill]');
    let thisPageData;
    
    if (pageName === 'index') return;

    getCurrentPageData(jsonDataPath, pageName).then(data => {

        // keep extracted data
        thisPageData = data;

        switch (pageName) {
        
            case 'destination':

                const chosenPlanet = sessionStorage.getItem('planet');

                if(chosenPlanet) {
                    // insert data for last choosen planet
                    switchPlanetButtons(chosenPlanet);
                    populateTargetElements(
                        thisPageData.find(item => item.name === chosenPlanet)
                    )
                } else {
                    // insert the initial data
                    populateTargetElements(thisPageData[0]);
                }

                manageChoosePlanetButtons();

                // moving stars
                const space = createStarsLayout();
                document.body.appendChild(space);
                createMovingStars(space);

                break;
    
            case 'crew':

                // insert the initial data
                populateTargetElements(thisPageData[0]);

                // swithers and autoswithing
                manageCrewMemberSwithing(
                    crewSlideInterval,
                    crewSlideDelay
                );

                break;
    
            case 'technology':

                // insert the initial data
                populateTargetElements(thisPageData[0]);

                break;
        }
    });

    // Caching data only once, not checking data.json update!
    async function getCurrentPageData(url, pageName) {
        const KEY = 'space-tourism-data';
        let commonData;

        if (localStorage.getItem(KEY)) {
            console.log('Data have read from local storage');

            // get data from local storage
            commonData = JSON.parse(
                localStorage.getItem(KEY)
            )

        } else {
            console.log('Data have read from data.json and saved in local storage');

            // get data from data.json
            const response = await fetch(url);
            commonData = await response.json();

            // save for future use
            localStorage.setItem(KEY, JSON.stringify(commonData));
        }

        const thisPageData = commonData[pageName];
        return thisPageData;
    }


    function switchPlanetButtons(chosenPlanet) {
        Array.from(
            document
                .querySelector('.destination__buttonsblock')
                .querySelectorAll(
                    `input[type='radio']`
                )
        ).forEach(
            radio => {
                if (radio.checked) radio.checked = false;
                if (radio.id === chosenPlanet) radio.checked = true;
            }
        )
    }


    function manageChoosePlanetButtons() {
        // work with form and radiobutton-labels which is kind of buttons as design result
        const form = document.querySelector('.destination__buttonsblock');

        let isTabNavigation = false;

        // manage mouse clicks and arrows keydown switching
        form.addEventListener('click', onClick);
        form.addEventListener('keydown', onKeydown);

        // diaplay arrow icons with tab navigation only
        manageVisualArrowAppearance();

        function onClick(event) {
            // do not handle right click or click past the button (lable)
            if ( event.button === 2 || event.target.tagName !== 'LABEL') return;

            // get planet name from attribute 'for'
            const requiredName = event.target.htmlFor;

            // keep for next visit
            sessionStorage.setItem('planet', requiredName);

            // find subdata with the same planet name
            const relevantData = getRelevantData(requiredName);

            // insert new data
            populateTargetElements(relevantData);
        }

        function onKeydown(event) {
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

                    // keep for next visit
                    sessionStorage.setItem('planet', requiredName);

                    // find subdata with the same planet name
                    const relevantData = getRelevantData(requiredName);

                    // isert the data
                    populateTargetElements(relevantData);
                }, 10)
            }
        }

        function manageVisualArrowAppearance() {
            form.addEventListener('focusin', (event) => {
                if (isTabNavigation) {
                    event.currentTarget.firstElementChild.classList.add('tab-navigation');
                } else {
                    event.currentTarget.firstElementChild.classList.remove('tab-navigation');
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') isTabNavigation = true;
            });
            document.addEventListener('mousedown', () => {
                isTabNavigation = false;
            });
        }

        function getRelevantData(name) {
            return thisPageData
                .find(subdata => subdata.name === name);
        }
    }


    function manageCrewMemberSwithing(crewSlidingInterval, delayAfterClick) {

        const buttonsBlock = document.querySelector('.crew__buttonsblock');
        const buttons = buttonsBlock.children;

        let currentSlideIndex = 0;

        let intervalId = startAutosliding();
        let delayId;

        buttonsBlock.addEventListener('click', event => {
            // do not handle right click or click past the button
            if ( event.button === 2 || event.target.tagName !== 'BUTTON') return;

            const buttonIndex = event.target.dataset.slideIndex;

            changeSlide(buttonIndex);
            delayAutosliding(delayAfterClick);
        });

        function changeSlide(index) {
            populateTargetElements(thisPageData[index]);
            changeActiveButton(buttons[index]);
            currentSlideIndex = index;
        }

        function startAutosliding() {
            return setInterval(() => {
                // loop in buttons amount
                currentSlideIndex++;
                if (currentSlideIndex > buttons.length - 1) currentSlideIndex = 0;
                
                changeSlide(currentSlideIndex);

            }, crewSlidingInterval);
        }

        function delayAutosliding(ms) {

            // stop autosliding
            clearInterval(intervalId);

            // reset previous delay and start autosliding after certain delay again
            clearTimeout(delayId);
            delayId = setTimeout(() => {
                intervalId = startAutosliding();
            }, ms);
        }

        function changeActiveButton(currentButtonElement) {
            Array.from(buttons).forEach((button)=> {
                if (
                    button === currentButtonElement ||
                    button.classList.contains('crew__button--checked')
                    ) {
                    button.classList.toggle('crew__button--checked')
                };
            })
        }
    }


    function populateTargetElements(relevantData) {

        targetElements.forEach((element) => {
                
            if (element.id === 'image') {

                if (relevantData.images.png) { // in data.json different img extentions
                    // choose image extention
                    const imgExtention = webpSupport ? 'webp' : 'png';
                    element.src = relevantData.images[imgExtention];
                    // set alt
                    element.alt = `${relevantData.name} photo`;
                }

                if (relevantData.images.portrait) { // in data.json different img ratio

                    // get breakpoint to change img size
                    element.src = (isDesktopMode()) ?
                        relevantData.images.portrait :
                        relevantData.images.landscape;

                    // set alt
                    element.alt = `${relevantData.name} photo`;
                }

            } else { // text data
                element.innerText = relevantData[element.id];
            }
        })
    }
}