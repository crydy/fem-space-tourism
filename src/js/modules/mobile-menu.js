import { setTransitionTemperory, isMobileMode, isElemsTouchingX } from "../utils/functions.js";
import { mobileMenuSetup as setup } from "../utils/mobile-menu-setup.js";


export function mobileMenu() {

    const parentElement = document.querySelector(`.${setup.parentElement}`);
    const menuElement = setupSideMenu(
        document.querySelector(`.${setup.menuElement}`)
    );
    const burgerElement = createBurgerButton();
    const overlay = createOverlay();

    parentElement.appendChild(burgerElement);
    document.body.appendChild(overlay);

    // keep button state
    let manuallyOpened = false;

    // toggle by click on button
    burgerElement.addEventListener('click', () => {
        manuallyOpened = !manuallyOpened;
        const isOpened = burgerElement.classList.contains('opened');
        if (isOpened) close();
        else open();
    })

    // close by click on overlay
    overlay.addEventListener('click', () => {
        manuallyOpened = !manuallyOpened;
        close();
    });

    // change menu and button state with viewport resize
    visualViewport.addEventListener("resize", () => {

                
        if (isMobileMode()) {

            if (!manuallyOpened) menuElement.hide('ho transition');

            burgerElement.hidden = false;
            menuElement.setPositionAbsolute();

        } else {

            burgerElement.hidden = true;
            menuElement.show('no transition');
            menuElement.clearPositionAbsolute();
        }




        // const blockElement = parentElement;

        // if (blockElement.scrollWidth > blockElement.clientWidth) {
        //     // Block is overflowing horizontally
        //     // Handle the overflow event here
        //     console.log('Block is overflowing horizontally');
        //   } else {
        //     // Block is not overflowing horizontally
        //     // Handle the non-overflow event here
        //     console.log('Block is not overflowing horizontally');
        //   }
    });

    // -----------------------------------------------
    function setupSideMenu(sideMenu) {
        
        sideMenu.hide = (noTransition) => {
            if (noTransition) {
                sideMenu.hidden = true;
            } else {
                setTimeout(() => sideMenu.hidden = true, setup.transitionTime * 1000);
                setTransitionTemperory(sideMenu, setup.transitionTime);
            }
            sideMenu.style.transform = 'translateX(100%)';
            sideMenu.classList.remove('opened');
        };
    
        sideMenu.show = (noTransition) => {
            sideMenu.hidden = false;

            if (noTransition) {
                sideMenu.style.transform = '';
                sideMenu.classList.add('opened');
            } else {
                setTimeout(() => {
                    setTransitionTemperory(sideMenu, setup.transitionTime);
                    sideMenu.style.transform = '';
                    sideMenu.classList.add('opened');
                }, setup.shortDelay);
            }
        };

        sideMenu.setPositionAbsolute = () => {
            sideMenu.style.position = 'absolute';
            sideMenu.style.top = 0;
            sideMenu.style.right = 0;
        }

        sideMenu.clearPositionAbsolute = () => {
            sideMenu.style.position = '';
            sideMenu.style.top = '';
            sideMenu.style.right = '';
        }

        // initial menu state
        sideMenu.style.zIndex = setup.menuZIndex;

        if (!isMobileMode()) {
            sideMenu.clearPositionAbsolute();
            sideMenu.show('no transition');
        } else  {
            sideMenu.setPositionAbsolute();
            sideMenu.hide('to transition');
        }

        return sideMenu;
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

        function createCoreButton() {
            const coreButton = document.createElement('button');
            coreButton.id = 'burger-button';
            coreButton.setAttribute('tabindex', '0');
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
        overlay.classList.add('overlay');

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

        overlay.show = function() {
            overlay.hidden = false;
            setTimeout(() => {
                this.style.backgroundColor = `rgba(0, 0, 0, ${setup.overlayOpacity})`;
            }, setup.shortDelay);
        }

        overlay.hide = function() {
            setTimeout(() => {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }, setup.shortDelay);
            setTimeout(() => {
                this.hidden = true;
            }, setup.transitionTime * 1000);
        }

        return overlay;
    }

    function close() {
        burgerElement.classList.remove('opened');
        menuElement.hide();
        overlay.hide();
        burgerElement.uncross();
    }

    function open() {
        burgerElement.classList.add('opened');
        menuElement.show();
        overlay.show();
        burgerElement.cross();
    }

    // function isOverflowed(element) {
    //     if (element.scrollWidth > element.clientWidth) {
    //         console.log('Block is overflowing horizontally');
    //     } else {
    //         console.log('Block is not overflowing horizontally');
    //     }
    // }
}