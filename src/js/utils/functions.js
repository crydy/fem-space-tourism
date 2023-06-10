

// fast console log functions
export function fastLog() {
    // log(subject)
    window.log = (value) => console.log(value);
    // dir(subject)
    window.dir = (value) => console.dir(value);
}


export function waitDOMContent() {
    return new Promise( resolve => {
        window.addEventListener('DOMContentLoaded', () => resolve());
    });
}


// check the browser for WEBP support,
// create 'webp'/'no-webp' class to HTML
// for use .webp images in css if browser support it
export function setBrowserWEBPSupportMark() {

    return new Promise((resolve) => {

        function testWebP(callback) {
            let webP = new Image();
            webP.onload = webP.onerror = function () {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";   
        }
        
        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
            
            resolve(support);
        });
    })
}


export function replaceImageExtensionToWEBP(string) {
    // Regular expression to match 'png' or 'jpg'
    var imageExtensionRegex = /(png|jpg)/g;
  
    // Replace the matched extensions with 'webp'
    var newString = string.replace(imageExtensionRegex, 'webp');
  
    return newString;
}


export function getCurrentPageName() {
    const currentPath = window.location.pathname; // '/pagename.html'
    const pageName = currentPath.split('/').pop().split('.')[0]; // 'pagename'
    return pageName;
}


export function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}


export function randomDecimalInRange(min, max, decimalDigits = 0) {
    const rand = Math.random() * (max - min) + min;
    
    if (decimalDigits > 0) {
      const factor = 10 ** decimalDigits;
      return Math.round(rand * factor) / factor;
    } else {
      return rand;
    }
}


export function randomColor(
    // all values range: 0-100
    minSaturation = 0,
    maxSaturation = 100,
    minLightness = 0,
    maxLightness = 100,
) {
    const letters = '0123456789ABCDEF';
    let color = '#';

    // Generate random hue (from blue to white)
    const hue = Math.floor(Math.random() * 181) + 180;

    const saturation = Math.floor(Math.random() * (maxSaturation - minSaturation + 1)) + minSaturation;

    const lightness = Math.floor(Math.random() * (maxLightness - minLightness + 1)) + minLightness;

    // Convert HSL values to RGB
    const rgb = hslToRgb(hue, saturation, lightness);

    // Convert RGB values to hexadecimal color code
    for (let i = 0; i < 3; i++) {
        color += letters[Math.floor(rgb[i] / 16)];
        color += letters[rgb[i] % 16];
    }
    return color;

    
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
        
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
        
            r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hue2rgb(p, q, h) * 255);
            b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
        }
        
        return [r, g, b];
    }
}


const activeElements = new Map(); // store elements that are in transition mode
export function replaceWithTransition(element, className, callback) {
    
    const TRANSITION_TIME = 250;
    const DELAY = 50;

    let elemTimerID;
 
    // 1 start transition

    if (!activeElements.has(element)) {
        setTransitionTemperory(element, TRANSITION_TIME);
        element.classList.add(className);
    }

    // 2 change data in element (start callback)

    if(callback) {
        setTimeout(() => {
            callback();
        }, TRANSITION_TIME);
    }

    // 3 start backward transition (anew for element which was already in transition state)

    if (activeElements.has(element)) clearTimeout(activeElements.get(element));

    elemTimerID = setTimeout(() => {
        setTransitionTemperory(element, TRANSITION_TIME);
        element.classList.remove(className);

        activeElements.delete(element);
    }, TRANSITION_TIME + DELAY);

    if (!activeElements.has(element)) activeElements.set(element, elemTimerID);
}


export function setTransitionTemperory(element, time, transitionProperty) { // time in sec

    if (transitionProperty) {
        element.style.transition = `${transitionProperty} ${time / 1000}s`;
    } else {
        element.style.transition = `${time / 1000}s`;
    }

    element.transitionMode = transitionProperty;
    
    setTimeout(() => {
        element.transitionMode = null;
        element.style.transition = '';
    }, time);
}


export function getBreakpoints(unit) {
    const dummyElement = document.createElement('div');
    dummyElement.style.display = 'none';

    document.body.appendChild(dummyElement);

    const computedStyles = window.getComputedStyle(dummyElement);
    const fontSize = parseFloat(computedStyles.fontSize);

    // get emBreakpoints in em
    const emBreakpoints = {
        medium: computedStyles.getPropertyValue('--breakpoint-medium'),
        large: computedStyles.getPropertyValue('--breakpoint-large'),
        xlarge: computedStyles.getPropertyValue('--breakpoint-xlarge'),
    }

    document.body.removeChild(dummyElement);

    if (unit === 'px') {

        const pxBreakpoints = {};
    
        for (const key in emBreakpoints) {
            pxBreakpoints[key] = parseFloat(emBreakpoints[key]) * fontSize;
        }

        return pxBreakpoints;
    }

    return emBreakpoints;
}


export function isMobileMode() {
    return !window.matchMedia(
        `(min-width: ${getBreakpoints().medium})`
    ).matches;
}


export function isDesktopMode() {
    return window.matchMedia(
        `(min-width: ${getBreakpoints().large})`
    ).matches;
}


export function isElemsTouchingX(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    // positions
    let leftBlock, rightBlock;

    if (rect1.left < rect2.left) {
        leftBlock = elem1;
        rightBlock = elem2;
    } else {
        leftBlock = elem2;
        rightBlock = elem1;
    }

    // pay attention to margins
    const margin1 = parseFloat(window.getComputedStyle(leftBlock).marginRight);
    const margin2 = parseFloat(window.getComputedStyle(rightBlock).marginLeft);

    const leftSurface = leftBlock.getBoundingClientRect().right + margin1;
    const rightSurface = rightBlock.getBoundingClientRect().left - margin2;

    // blocks are touching or overlapping, considering margins
    return leftSurface >= rightSurface;
}