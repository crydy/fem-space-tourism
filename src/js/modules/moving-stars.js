import { randomInteger, randomDecimalInRange } from "../utils/functions.js";
export {createStarsLayout, createMovingStars, countStars};


function createMovingStars(spaceElement, options = {}) {
    const {
        numStarsOnStart = 30,
        numStarsMax = 50,

        movement = true,
        minMoveSpeed = 2,
        maxMoveSpeed = 5,
        
        intervalTiming = 1500,
        minAppearDuration = 1000,
        maxAppearDuration = 6000,
        minDisappearDuration = 5000,
        maxDisappearDuration = 15000,
        minTransitionDuration = 1500,
        maxTransitionDuration = 3000,

        minStarSize = .5,
        maxStarSize = 3.2,
        minOpacity = 0.7,
        maxOpacity = 1,

        showHalo = false,
        haloColor = '#fff',
        minHaloBlur = 4,
        maxHaloBlur = 15,
        minHaloOpacity = 0.4,
        maxHaloOpacity = 0.8,
    } = options;


    populateSky();

    function populateSky() {
        let isSkyPopulated = false;

        // iteration of population
        const action = () => {

            // get sky limits (everytime anew for possibe viewport size change case)
            const blockRect = spaceElement.getBoundingClientRect();
            const minX = blockRect.left;
            const maxX = blockRect.right - maxStarSize;
            const minY = blockRect.top;
            const maxY = blockRect.bottom - maxStarSize;
            
            // find center of space
            const spaceCenterX = blockRect.left + blockRect.width / 2;
            const spaceCenterY = blockRect.top + blockRect.height / 2;

            // avoid if too much stars
            const existingStars = spaceElement.querySelectorAll('.star').length;
            if (existingStars >= numStarsMax) return;

            const starsAmount = (isSkyPopulated) ? (numStarsMax - existingStars) : numStarsOnStart;

            // create and insert set of stars
            for (let i = 0; i < starsAmount; i++) {
    
                // star settings
                const starSize = randomDecimalInRange(minStarSize, maxStarSize, 1);
                const randomX = getRandomX(movement, minX, maxX, starSize);
                const randomY = getRandomY(movement, minY, maxY, starSize);
                const appearDuration = randomInteger(minAppearDuration, maxAppearDuration);
                const disappearDuration = randomInteger(minDisappearDuration, maxDisappearDuration);
                const opacity = randomDecimalInRange(minOpacity, maxOpacity, 1);
                const transitionDuration = randomDecimalInRange(
                    minTransitionDuration / 1000, maxTransitionDuration /1000, 1
                );
    
                // create and insert
                const star = createStar(starSize, opacity, randomX, randomY);
                star.style.transitionDuration = `${transitionDuration}s`;
                spaceElement.appendChild(star);
                
                if (isSkyPopulated) {
                    star.style.opacity = 0;
                }
                
                // lifespan
                setTimeout(() => { // appear visually
    
                    star.style.opacity = opacity;
                    
                    setTimeout(() => { // fade out
                        star.style.opacity = 0;
    
                        setTimeout(() => { // die
                            star.remove();
                        }, transitionDuration * 1000);
                        
                    }, disappearDuration);
    
                }, appearDuration);

                const starLifespan = appearDuration + disappearDuration + (transitionDuration * 1000);
    
                if (movement) {
                    // moving settings
                    const moveDirectionX = star.getBoundingClientRect().left - spaceCenterX;
                    const moveDirectionY = star.getBoundingClientRect().top - spaceCenterY;
                    const moveDistance = Math.sqrt(moveDirectionX ** 2 + moveDirectionY ** 2);
                    const moveSpeed = randomDecimalInRange(minMoveSpeed, maxMoveSpeed, 1);
                    let moveDuration = moveDistance / moveSpeed * 1000;

                    if (starLifespan > moveDuration) moveDuration = starLifespan;
            
                    // start moving at the moment of appearance
                    if(isSkyPopulated) {

                        setTimeout(() => {
                            move();
                        }, appearDuration);

                    } else {

                        move();
                        setTimeout(() => {
                            isSkyPopulated = true;
                        }, appearDuration);
                    }

                    function move() {
                        star.style.transition = `
                            left ${moveDuration}ms linear,
                            top ${moveDuration}ms linear,
                            ${star.style.transition}
                        `; // line 3 - keep transition that already exist
                        star.style.left = `${randomX + moveDirectionX}px`;
                        star.style.top = `${randomY + moveDirectionY}px`;

                        setTimeout(move, moveDuration);
                    }
                }
            }
        }

        // start loop
        action();
        setInterval(action, intervalTiming);
    }

    function createStar(starSize, opacity, randomX, randomY) {
        const randomHaloBlur = randomInteger(maxHaloBlur, minHaloBlur);
        const star = document.createElement('div');
        star.classList.add('star');
        
        star.style.position = 'absolute';
        star.style.zIndex = '-1';
        star.style.width = starSize + 'px';
        star.style.height = starSize + 'px';
        star.style.backgroundColor = getRandomColor();
        star.style.borderRadius = '50%';
        star.style.opacity = opacity;
        star.style.transition = 'opacity linear';
        star.style.left = randomX + 'px';
        star.style.top = randomY + 'px';

        if (showHalo) {
            const halo = document.createElement('div');
            halo.classList.add('halo');
            halo.style.position = 'absolute';
            halo.style.width = starSize + 'px';
            halo.style.height = starSize + 'px';
            halo.style.borderRadius = '50%';
            halo.style.backgroundColor = haloColor;
            halo.style.filter = `blur(${randomHaloBlur}px)`;
            halo.style.opacity = randomDecimalInRange(
                minHaloOpacity, maxHaloOpacity, 1
            );
            star.appendChild(halo);
        }

        return star;
    }

    function getRandomX(movement, minX, maxX, starSize) {

        if (movement) {
            const offsetX = starSize / 2;
            return Math.floor(Math.random() * (maxX - minX - offsetX + 1)) + minX;
        } else { // static
            return Math.floor(Math.random() * ((maxX - minX) + 1)) + minX;
        }
    }

    function getRandomY(movement, minY, maxY, starSize) {
        if (movement) {
            const offsetY = starSize / 2;
            return Math.floor(Math.random() * (maxY - minY - offsetY + 1)) + minY + offsetY;
        } else { // static
            return Math.floor(Math.random() * ((maxY - minY) + 1)) + minY;
        }
    }
}


function createStarsLayout() {
    const space = document.createElement('div');

    space.style.position = 'relative';
    space.style.position = 'fixed';
    space.style.zIndex = '-1';
    space.style.top = '0';
    space.style.left = '0';
    space.style.width = '100%';
    space.style.height = '100%';

    return space;
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    // Generate random hue (from blue to white)
    const hue = Math.floor(Math.random() * 181) + 180;

    // Adjust the saturation range (0-100)
    const minSaturation = 2;
    const maxSaturation = 14;
    const saturation = Math.floor(Math.random() * (maxSaturation - minSaturation + 1)) + minSaturation;

    // Adjust the lightness range (0-100)
    const minLightness = 40;
    const maxLightness = 90;
    const lightness = Math.floor(Math.random() * (maxLightness - minLightness + 1)) + minLightness;

    // Convert HSL values to RGB
    const rgb = hslToRgb(hue, saturation, lightness);

    // Convert RGB values to hexadecimal color code
    for (let i = 0; i < 3; i++) {
        color += letters[Math.floor(rgb[i] / 16)];
        color += letters[rgb[i] % 16];
    }
    return color;
}


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


function countStars(ms = 10000) {
    console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    setInterval(() => {
        console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    }, ms)
}