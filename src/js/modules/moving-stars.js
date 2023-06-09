import { randomInteger, randomDecimalInRange, randomColor } from "../utils/functions.js";
import { movingStarsSettings as initSetup } from "../utils/project-setup.js";

export { createSpaceElement, createMovingStars, countStars };


function createMovingStars(spaceElement, options = initSetup) {
    const {
        numStarsOnStart, numStarsMax, movement, minMoveSpeed, maxMoveSpeed,
        intervalTiming, minAppearDuration, maxAppearDuration,
        minDisappearDuration, maxDisappearDuration, minTransitionDuration,
        maxTransitionDuration, minStarSize, maxStarSize, minOpacity, maxOpacity,
        showHalo, haloColor, minHaloBlur, maxHaloBlur, minHaloOpacity, maxHaloOpacity,
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
        star.style.backgroundColor = randomColor(2, 14, 40, 90);
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


function createSpaceElement() {
    const space = document.createElement('div');
    space.classList.add('space-overlay');

    space.style.position = 'relative';
    space.style.position = 'fixed';
    space.style.zIndex = '-1';
    space.style.top = '0';
    space.style.left = '0';
    space.style.width = '100%';
    space.style.height = '100%';

    return space;
}


function countStars(ms = 4000) {
    console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    setInterval(() => {
        console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    }, ms)
}