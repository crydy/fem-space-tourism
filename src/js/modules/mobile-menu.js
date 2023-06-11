import { setTransitionTemperory, isMobileMode } from "../utils/functions.js";
import { mobileMenuSettings as setup } from "../utils/project-setup.js";


export function setupMobileMenu() {

    const state = {
        isMobileMode: isMobileMode(),
        isOpened: false,
        isSwithing: false,

        toMobile() { this.isMobileMode = true },
        toDesktop() { this.isMobileMode = false },

        open() {this.isOpened = true},
        close() {this.isOpened = false},

        startSwitching() {this.isSwithing = true},
        stopSwitching() {this.isSwithing = false},

        log() {
            let logText = '';
            if (!this.isMobileMode) {
                logText += 'Desktop mode';
                log(logText);
            } else {
                logText += 'Mobile mode: ';
                if (this.isOpened) {
                    log(logText += 'opened');
                } else {
                    log(logText += 'closed');
                }
            }
        }
    }

    const parentElement = document.querySelector(`.${setup.parentElement}`);
    const overlay = createOverlay();
    const burgerElement = createBurgerButton();
    const menuElement = setupSideMenu(
        document.querySelector(`.${setup.menuElement}`)
    );

    parentElement.appendChild(burgerElement);
    document.body.appendChild(overlay);


    // toggle menu by button click
    burgerElement.addEventListener('click', () => {
        if (state.isSwithing) return;

        if (state.isOpened) close();
        else open();
    })

    // close by click on overlay
    overlay.addEventListener('click', () => {
        close();
    });

    // change menu and button state with viewport resize
    let previousState = isMobileMode();
    visualViewport.addEventListener("resize", () => {

        if (previousState !== isMobileMode()) { // breakpoint passed, apply changes
            previousState = isMobileMode();

            if (isMobileMode()) {

                burgerElement.appear();
                menuElement.toMobileView();

                if (!state.isOpened) {
                    menuElement.hide('no transition')
                } else {
                    overlay.show('no transition');
                }
    
                state.toMobile();
            } else {
                
                burgerElement.disappear();
                menuElement.toDesktopView();
                overlay.hide('no transition');

                state.toDesktop();
            }
        }
    });

    // loop tab navitagion in open menu in mobile mode
    manageMenuTabNavigation(
        burgerElement,
        ...menuElement.querySelectorAll('a')
    );

    
    // -----------------------------------------------
    function setupSideMenu(sideMenu) {

        const menuWidth = setup.menuWidth;
    
        sideMenu.show = (transitionState) => {
            sideMenu.hidden = false;
            
            if (transitionState !== 'no transition') {
                state.startSwitching();
                
                setTimeout(() => {
                    setTransitionTemperory(sideMenu, setup.transitionTime * 1000, 'width');
                    sideMenu.style.width = `${menuWidth}px`;
                }, setup.shortDelay);

                setTimeout(() => {
                    state.stopSwitching();
                }, setup.transitionTime * 1000);

                if(state.isMobileMode) disableVerticalScroll();
            }
        };

        sideMenu.hide = (transitionState) => {
            
            if (transitionState !== 'no transition')  {
                state.startSwitching();

                setTimeout(() => {
                    sideMenu.style.width = '0';
                    sideMenu.hidden = true;
                    state.stopSwitching();

                }, setup.transitionTime * 1000);

                setTransitionTemperory(sideMenu, setup.transitionTime * 1000, 'width');
            } else {
                sideMenu.hidden = true;
            }

            sideMenu.style.width = '0';
            enableVerticalScroll();
        };

        sideMenu.toMobileView = () => {
            sideMenu.style.position = 'absolute';
            sideMenu.style.overflow = 'hidden';
            sideMenu.style.top = 0;
            sideMenu.style.right = 0;
            sideMenu.style.zIndex = setup.menuZIndex;
            sideMenu.style.width = (state.isOpened) ? `${menuWidth}px` : '0';
        };

        sideMenu.toDesktopView = () => {
            sideMenu.style.position = '';
            sideMenu.style.overflow = '';
            sideMenu.style.top = '';
            sideMenu.style.right = '';
            sideMenu.style.zIndex = '';
            sideMenu.style.width = '';

            sideMenu.show('no transition');
        };

        // initial menu state
        if (isMobileMode()) {
            sideMenu.toMobileView();
            sideMenu.hide('no transition');
        };

        return sideMenu;

        function enableVerticalScroll() {
            document.body.style.overflow = 'auto';
        }

        function disableVerticalScroll() {
            document.body.style.overflow = 'hidden';
        }
    }

    function createBurgerButton() {

        // create button
        const burgerButtonElement = createCoreButton();

        // initial state
        if (!isMobileMode()) burgerButtonElement.hidden = true;
        else burgerButtonElement.hidden = false;

        // create inner bars
        const bars = createInnerBars();
        const [bar1, bar2] = bars;
        burgerButtonElement.appendChild(bar1);
        burgerButtonElement.appendChild(bar2);

        // methods
        burgerButtonElement.cross = () => {
            bar1.cross();
            bar2.cross();
        }

        burgerButtonElement.uncross = () => {
            bar1.uncross();
            bar2.uncross();
        }

        burgerButtonElement.appear = () => {
            burgerButtonElement.hidden = false;
        }

        burgerButtonElement.disappear = () => {
            burgerButtonElement.hidden = true;
        }

        function createCoreButton() {
            const coreButton = document.createElement('button');
            coreButton.id = 'burger-button';
            coreButton.setAttribute('tabindex', '1');
            coreButton.style.cursor = 'pointer';
            coreButton.style.margin = 0;
            coreButton.style.padding = 0;
            coreButton.style.border = 'none';
            coreButton.style.setProperty('--trans-time', `${setup.transitionTime}s`);
            coreButton.style.outline = 'none';
            coreButton.style.zIndex = setup.burgerButtonZIndex;
            coreButton.style.position = 'relative';
            coreButton.style.background = 'transparent';
            coreButton.style.height = setup.buttonHeight / 16 + 'rem';
            coreButton.style.width = setup.buttonWidth / 16 + 'rem';

            return coreButton;
        }

        function createInnerBars() {

            // create
            const bar1 = document.createElement('span');
            const bar2 = document.createElement('span');
            bar1.classList.add('bar1');
            bar2.classList.add('bar2');
    
            const bars = [bar1, bar2];
    
            // set stiles
            const boxShadow = `
                ${setup.buttonColor} 0 ${
                    // middle bar position
                    ( (setup.buttonHeight / 2 + setup.barHeight / 2) - setup.barHeight ) / 16
                }rem 0 0
            `;
    
            const bar2YShift = `${ (setup.buttonHeight - setup.barHeight) / 16 }rem`;
            const crossYShift = `${(setup.buttonHeight / 2 - setup.barHeight / 2) / 16}rem`;
    
            bars.forEach(bar => {
                bar.style.display = 'block';
                bar.style.position = 'absolute';
                bar.style.backgroundColor = setup.buttonColor;
                bar.style.left = 0;
                bar.style.height = setup.barHeight / 16 + 'rem';
                bar.style.width = setup.buttonWidth / 16 + 'rem';
                bar.style.transition = `${setup.transitionTime}s`;
            });
            bar1.style.top = 0;
            bar1.style.boxShadow = boxShadow;
            bar2.style.top = bar2YShift;

            // set methods
            bar1.cross = () => {
                bar1.style.boxShadow = 'transparent 0 0 0 0';
                bar1.style.top = crossYShift;
                bar1.style.transform = 'rotate(225deg)';
            }
            bar1.uncross = () => {
                bar1.style.boxShadow = boxShadow;
                bar1.style.top = '0';
                bar1.style.transform = '';
            }
            bar2.cross = () => {
                bar2.style.top = crossYShift;
                bar2.style.transform = 'rotate(315deg)';
            }
            bar2.uncross = () => {
                bar2.style.top = bar2YShift;
                bar2.style.transform = '';
            }

            return bars;
        }

        return burgerButtonElement;
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('mobile-menu-overlay');

        overlay.hidden = true;

        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = setup.overlayZIndex;
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.transition = `
            background-color ${setup.transitionTime}s ${setup.transTimingFunc}
        `;

        overlay.show = function(noTransition) {
            overlay.hidden = false;
            
            if (!noTransition) {
                setTimeout(() => {
                    this.style.backgroundColor = `rgba(0, 0, 0, ${setup.overlayOpacity})`;
                }, setup.shortDelay);
            }
        }

        overlay.hide = function(noTransition) {
            
            if (noTransition) {
                this.hidden = true;
            } else {
                setTimeout(() => {
                    this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                }, setup.shortDelay);
                setTimeout(() => {
                    this.hidden = true;
                }, setup.transitionTime * 1000);
            }
        }

        return overlay;
    }

    function manageMenuTabNavigation(...elems) {

        const onlyActiveElems = [];

        elems.forEach(elem => {
            if (elem.getAttribute('tabindex') !== '-1') onlyActiveElems.push(elem);
        });

        const firstElem = onlyActiveElems[0]
        const lastElem = onlyActiveElems[onlyActiveElems.length - 1];
        
        // loop tab navigation in mobile mode when menu opened
        window.addEventListener('keydown', (event) => {
            
            if (state.isMobileMode && state.isOpened) {

                if (event.key === 'Tab') {
                    
                    if (!event.shiftKey && event.target === lastElem) {
                        event.preventDefault();
                        firstElem.focus();
                    }
                    
                    if (event.shiftKey && event.target === firstElem) {
                        event.preventDefault();
                        lastElem.focus();
                    }
                }
            }
        });

    }

    function close() {
        burgerElement.uncross();
        menuElement.hide();
        overlay.hide();

        state.close();
    }

    function open() {
        burgerElement.cross();
        menuElement.show();
        overlay.show();

        state.open();
    }
}