// fast console log functions
export function fastLog() {
    // log(subject)
    window.log = (value) => console.log(value);
    // subject.log()
    Object.prototype.log = function() {
        console.log(this);
    };
}


export function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}


export function setTransitionTemperory(element, time, transitionProperty) { // time in sec

    if (transitionProperty) {
        element.style.transition = `${transitionProperty} ${time}s`;
    } else {
        element.style.transition = `${time}s`;
    }

    element.transitionMode = transitionProperty;
    
    setTimeout(() => {
        element.transitionMode = null;
        element.style.transition = '';
    }, time * 1000);
}


export function getBreakpoints() {
    const dummyElement = document.createElement('div');
    dummyElement.style.display = 'none';

    document.body.appendChild(dummyElement);

    const computedStyles = window.getComputedStyle(dummyElement);

    const breakpoints = {
        medium: computedStyles.getPropertyValue('--breakpoint-medium'),
        large: computedStyles.getPropertyValue('--breakpoint-large'),
        xlarge: computedStyles.getPropertyValue('--breakpoint-xlarge'),
    };

    document.body.removeChild(dummyElement);

    return breakpoints;
}

export function isMobileMode() {
    return !window.matchMedia(
        `(min-width: ${getBreakpoints().medium})`
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