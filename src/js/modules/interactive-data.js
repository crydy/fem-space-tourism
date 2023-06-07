import {
    createStarsLayout,
    createMovingStars
} from "./moving-stars.js";

import { isDesktopMode, replaceWithTransition } from "../utils/functions.js";

export default function fillPage(
    jsonDataPath,
    webpSupport,
    crewSlideInterval,
    crewSlideDelay
) {
    const TRANSITION_CLASS_TEXT = 'js-transition-text';
    const TRANSITION_CLASS_IMAGE = 'js-transition-image';
    const TRANSITION_CLASS_IMAGE_PLANET = 'js-transition-image-planet';
    const TRANSITION_CLASS_IMAGE_TECHNOLOGY = 'js-transition-image-technology';

    const currentPath = window.location.pathname; // '/pagename.html'
    const pageName = currentPath.split('/').pop().split('.')[0]; // 'pagename'
    
    const targetElements = document.querySelectorAll('[data-js-fill]');
    let thisPageData;
    
    if (pageName === 'index') return;

    getCurrentPageData(jsonDataPath, pageName).then(data => {

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

                // inset moving stars
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

                manageIMGResize();
                manageTechnologySwithers();
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
            populateTargetElements(relevantData, 'transition');
            transitionAdditionalElements('.details-title');
        }

        function onKeydown(event) {

            if (
                event.key === 'ArrowLeft' ||
                event.key === 'ArrowRight' ||
                event.key === 'ArrowUp' ||
                event.key === 'ArrowDown'
            ) {

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
                    populateTargetElements(relevantData, 'transition');
                    transitionAdditionalElements('.details-title');
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
            window.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') isTabNavigation = true;
            });
            window.addEventListener('mousedown', () => {
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
        const buttonsNodeList = buttonsBlock.children;

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
            populateTargetElements(thisPageData[index], 'transition');
            SwitchActiveButton(buttonsNodeList[index]);
            currentSlideIndex = index;
        }

        function startAutosliding() {
            return setInterval(() => {
                // loop in buttons amount
                currentSlideIndex++;
                if (currentSlideIndex > buttonsNodeList.length - 1) currentSlideIndex = 0;
                
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

        function SwitchActiveButton(currentButtonElement) {
            toggleClassesInButtonsBlock(currentButtonElement, buttonsNodeList, 'crew__button--checked');
            switchTabindexesInButtonsBlock(currentButtonElement, buttonsNodeList);
        }
    }


    function manageTechnologySwithers() {
        const buttonsBlock = document.querySelector('.technology__buttonsblock');
        const buttonsNodeList = buttonsBlock.children;
        
        buttonsBlock.addEventListener('click', onClick);
        
        function onClick(event) {
            const button = event.target;
            const index = Array.from(buttonsNodeList).indexOf(button);

            if (index !== -1) { // manage active buttons only
                populateTargetElements(thisPageData[index], 'transition');
                switchActiveButton(event);
            }
        }

        function switchActiveButton(event) {
            const targetButton = event.target;
            toggleClassesInButtonsBlock(targetButton, buttonsNodeList, 'technology__button--checked')
            switchTabindexesInButtonsBlock(targetButton, buttonsNodeList);
        }
    }

    
    function toggleClassesInButtonsBlock(targetButtonElement, buttonsNodeList, className) {
        Array.from(buttonsNodeList).forEach((button)=> {
            if (
                button === targetButtonElement ||
                button.classList.contains(className)
            ) {
                button.classList.toggle(className);
            };
        })
    }


    function switchTabindexesInButtonsBlock(targetButtonElement, buttonsNodeList) {
        Array.from(buttonsNodeList).forEach((button)=> {

            // exclude current button from tab navigation
            if (button === targetButtonElement) {
                button.setAttribute('tabindex', '-1');
            };

            // include previous one which was excluded
            if (
                button.getAttribute('tabindex') === '-1' &&
                button !== targetButtonElement
            ) {
                button.setAttribute('tabindex', '0');
            }
        })
    }


    function manageIMGResize() {
        // some additional logic here to trigger
        // evaluations only when the breakpoint passed

        let isDesktopState = false;
        
        window.addEventListener('resize', () => {
            const currentIsDesktopState = isDesktopMode();

            if(isDesktopState !== currentIsDesktopState) {
                isDesktopState = currentIsDesktopState;

                const imgElement = document.querySelector('#image');
                const nameElement = document.querySelector('#name');
        
                const imgUrlSet = thisPageData.find(
                    array => array.name.toLowerCase() === nameElement.innerText.toLowerCase()
                ).images;
    
                if (isDesktopMode()) imgElement.src = imgUrlSet.portrait;
                else imgElement.src = imgUrlSet.landscape;
            };
        });
    }


    function populateTargetElements(relevantData, transition) {

        targetElements.forEach((element) => {

            if (element.id === 'image') {

                if (relevantData.images.png) { // in data.json different img extentions

                    const imgExtention = webpSupport ? 'webp' : 'png';
                    const replaceImage = () => {
                        element.src = relevantData.images[imgExtention];
                        element.alt = `${relevantData.name} photo`;
                    };

                    if(transition) {
                        const imgClass = (element.dataset.jsFill === 'planet-image') ?
                            TRANSITION_CLASS_IMAGE_PLANET :
                            TRANSITION_CLASS_IMAGE;

                        replaceWithTransition(element, imgClass, replaceImage);
                    } else {
                        replaceImage();
                    };
                }

                if (relevantData.images.portrait) { // in data.json different img ratio

                    const replaceImage = () => {
                        element.src = (isDesktopMode()) ?
                            relevantData.images.portrait :
                            relevantData.images.landscape;
    
                        element.alt = `${relevantData.name} photo`;
                    };

                    if(transition) {
                        const imgClass = (isDesktopMode()) ?
                        TRANSITION_CLASS_IMAGE :
                        TRANSITION_CLASS_IMAGE_TECHNOLOGY;

                        replaceWithTransition(element, imgClass, replaceImage);
                    } else {
                        replaceImage();
                    };
                }

            } else { // text data

                if(transition) {
                    replaceWithTransition(element, TRANSITION_CLASS_TEXT, replaceText);
                } else {
                    replaceText();
                }

                function replaceText() {
                    element.innerText = relevantData[element.id];
                }
            }
        })
    }
    

    function transitionAdditionalElements(...classList) {
        classList.forEach(className => {
            
            document.querySelectorAll(className).forEach(elem => {
                replaceWithTransition(elem, 'js-transition-text');
            });
        })
    }
}