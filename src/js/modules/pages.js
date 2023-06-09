import { getCurrentPageName, isDesktopMode, isMobileMode, replaceWithTransition } from "../utils/functions.js";
import { createSpaceElement, createMovingStars } from "./moving-stars.js";
import { pagesSetup } from "../utils/project-setup.js";


export default function fillPage(
    jsonDataPath,
    webpSupport,
) {
    const currentPage = getCurrentPageName();
    const targetElements = document.querySelectorAll('[data-js-fill]');
    
    const jsTransClass = pagesSetup.jsTransitionClasses;
    const planetTransBgImgSet = pagesSetup.planetTransBgImgSet;
    const crewSlideInterval = pagesSetup.crewPageAutosliding.slideInterval;
    const crewSlideDelay = pagesSetup.crewPageAutosliding.slideDelayAfterUserClick;
    
    let thisPageData;

    if (currentPage === 'index') {
        
        // live stars on the page
        runMovingStars();
        // png image of planet with transparent bg to overlay moving stars layer
        // (must follow to overlay, same z-index!)
        insertFrontPlanetOverlay(planetTransBgImgSet.homePage);

        return;
    };

    // fill inner pages with data from data.json
    getCurrentPageData(jsonDataPath, currentPage).then(fetchedData => {

        thisPageData = fetchedData;
        let initialData = thisPageData[0];

        switch (currentPage) {
        
            case 'destination':
                const chosenPlanet = sessionStorage.getItem('planet');

                if(chosenPlanet) {
                    switchPlanetButtons(chosenPlanet);
                    populateTargetElements(
                        thisPageData.find(item => item.name === chosenPlanet)
                    )
                } else {
                    populateTargetElements(initialData);
                }

                manageDestinationPageButtons();
                runMovingStars();
                break;
    
            case 'crew':
                populateTargetElements(initialData);

                manageCrewMemberSwithing(
                    crewSlideInterval,
                    crewSlideDelay
                );

                runMovingStars();
                insertFrontPlanetOverlay(planetTransBgImgSet.crewPage);
                break;
    
            case 'technology':
                populateTargetElements(initialData);
                manageTechnologyPageIMGResize();
                manageTechnologyPageButtons();
                break;
        }
    });

    // Caching data only once (no updates from data.json implemented)
    async function getCurrentPageData(url, currentPage) {
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

        const thisPageData = commonData[currentPage];
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


    function manageDestinationPageButtons() {
        // work with form and radiobutton-labels, which is kind of buttons by design
        const form = document.querySelector('.destination__buttonsblock');

        let isTabNavigation = false;

        form.addEventListener('click', onClick);
        form.addEventListener('keydown', onKeydown);

        // diaplay arrow-icons with tab navigation only
        manageVisualArrowAppearance();

        function onClick(event) {
            // do not handle right click or click past the button (lable)
            if ( event.button === 2 || event.target.tagName !== 'LABEL') return;

            // get planet name from attribute 'for'
            const requiredName = event.target.htmlFor;

            // keep for next visit in this session
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
            setActiveButton(currentButtonElement, buttonsNodeList, 'crew__button--checked');
        }
    }


    function manageTechnologyPageButtons() {
        const buttonsBlock = document.querySelector('.technology__buttonsblock');
        const buttonsNodeList = buttonsBlock.children;
        
        buttonsBlock.addEventListener('click', onClick);
        
        function onClick(event) {
            const clickedButton = event.target;
            const index = Array.from(buttonsNodeList).indexOf(clickedButton);

            if (index !== -1) { // manage active buttons only
                populateTargetElements(thisPageData[index], 'transition');
                setActiveButton(event.target, buttonsNodeList, 'technology__button--checked')
            }
        }
    }

    
    function setActiveButton(targetButtonElement, buttonsNodeList, className) {
        Array.from(buttonsNodeList).forEach((button)=> {
            // toggle class
            if (
                button === targetButtonElement ||
                button.classList.contains(className)
            ) {
                button.classList.toggle(className);
            };

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


    function manageTechnologyPageIMGResize() {
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
                            jsTransClass.imagePlanet :
                            jsTransClass.image;

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
                            jsTransClass.image :
                            jsTransClass.imageTech;

                        replaceWithTransition(element, imgClass, replaceImage);
                    } else {
                        replaceImage();
                    };
                }

            } else { // text data

                if(transition) {
                    replaceWithTransition(element, jsTransClass.text, replaceText);
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


    function runMovingStars() {
        const space = createSpaceElement();
        document.body.appendChild(space);
        createMovingStars(space);
    }


    // planet (cover layer) to overlay stars
    // (must follow in the code to overlay stars: same z-index!)
    function insertFrontPlanetOverlay(imgSet) {

        const planetOnFront = createFrontPlanetLayer();

        document.body.append(planetOnFront);
        setIMG(imgSet);

        changeImageOnResize();

        function createFrontPlanetLayer() {
            const overlay = document.createElement('div');
            overlay.classList.add('planet-in-front');

            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100%';
            overlay.style.zIndex = -1;

            overlay.style.backgroundRepeat = 'no-repeat';
            overlay.style.backgroundSize = 'cover';
            overlay.style.backgroundAttachment = 'fixed';
            overlay.style.backgroundPosition = 'center';

            return overlay;
        }

        function changeImageOnResize() {

            let previousState;
    
            if (isMobileMode()) {
                previousState = 'mobile';
            } else if (isDesktopMode()) {
                previousState = 'desktop';
            } else {
                previousState = 'tablet';
            }
    
            window.addEventListener('resize', () => {
                let currentState;
    
                if (isMobileMode()) {
                    currentState = 'mobile';
                } else if (isDesktopMode()) {
                    currentState = 'desktop';
                } else {
                    currentState = 'tablet';
                }
    
                if (previousState !== currentState) {
                    previousState = currentState;
                    // change image
                    setIMG(imgSet);
                }
            })
        }

        function setIMG(imgSet) {
            if (isMobileMode()) {
                // set mobile img
                planetOnFront.style.backgroundImage = `${imgSet.mobile}`;
            } else if (isDesktopMode()) {
                // set desktop img
                planetOnFront.style.backgroundImage = `${imgSet.desktop}`;
            } else {
                // set tablet img
                planetOnFront.style.backgroundImage = `${imgSet.tablet}`;;
            }
        }
    }
}