export const pagesSetup = {

    jsonDataPath: 'files/data.json',

    // autoswitching data in crew page
    crewPageAutosliding: {
        slideInterval: 8000,
        slideDelayAfterUserClick: 15000
    },

    // use for stilisation changing data by JS
    jsTransitionClasses: {
        text: 'js-transition-text',
        image: 'js-transition-image',
        imagePlanet: 'js-transition-image-planet',
        imageTech: 'js-transition-image-technology',
    },

    // png image of planet with transparent bg to overlay moving stars layer
    // (must follow to overlay, same z-index!)
    firstPlanIMGSet(isWebpSupported) {
        const ext = isWebpSupported ? 'webp' : 'png';

        return {
            homePage: {
                mobile: `url("./img/home/background-home-mobile-front.${ext}")`,
                tablet: `url("./img/home/background-home-tablet-front.${ext}")`,
                desktop: `url("./img/home/background-home-desktop-front.${ext}")`,
            },
            crewPage: {
                mobile: `url("./img/crew/background-crew-mobile-front.${ext}")`,
                tablet: `url("./img/crew/background-crew-tablet-front.${ext}")`,
                desktop: `url("./img/crew/background-crew-desktop-front.${ext}")`,
            }
        }
    }
}

export const mobileMenuSettings = {
    // clases
    parentElement: 'header',
    menuElement: 'header__nav',

    // timing
    transitionTime: .5,
    transTimingFunc: 'ease-in-out',

    // button setup (px sizes - will be converted in rem))
    buttonColor: '#fff',
    buttonHeight: 21,
    buttonWidth: 24,
    barHeight: 3,

    // overlay
    overlayOpacity: .15,

    // Z-position on page
    burgerButtonZIndex: 3,
    menuZIndex: 2,
    overlayZIndex: 1,

    // delay between element appearance and it's transition
    shortDelay: 20,
}

export const movingStarsSettings = {
    numStarsOnStart: 30,
    numStarsMax: 50,

    movement: true,
    minMoveSpeed: 2,
    maxMoveSpeed: 5,
    
    intervalTiming: 1500,
    minAppearDuration: 1000,
    maxAppearDuration: 6000,
    minDisappearDuration: 5000,
    maxDisappearDuration: 15000,
    minTransitionDuration: 1500,
    maxTransitionDuration: 3000,

    minStarSize: .5,
    maxStarSize: 3.2,
    minOpacity: 0.7,
    maxOpacity: 1,

    showHalo: false,
    haloColor: '#fff',
    minHaloBlur: 4,
    maxHaloBlur: 15,
    minHaloOpacity: 0.4,
    maxHaloOpacity: 0.8,
}