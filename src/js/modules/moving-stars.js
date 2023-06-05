export {createStarsLayout, createMovingStars, countStars};


function createMovingStars(spaceElement, options = {}) {
    const {
        numStarsOnStart = 25,
        numStarsMax = 35,
        maxStarsPerInterval = 15,
        intervalTiming = 500,
        minAppearDuration = 2000,
        maxAppearDuration = 15000,
        minDisappearDuration = 5000,
        maxDisappearDuration = 35000,
        minStarSize = .5,
        maxStarSize = 3.2,
        minOpacity = 0.8,
        maxOpacity = 1,
        showHalo = true,
        haloColor = '#ffffff',
        minHaloBlur = 5,
        maxHaloBlur = 20,
        minHaloOpacity = 0.4,
        maxHaloOpacity = 0.8,
        movement = 'centerToSides',
        minMoveSpeed = 2,
        maxMoveSpeed = 6,
    } = options;


    const randomHaloBlur = Math.floor(Math.random() * (maxHaloBlur - minHaloBlur + 1)) + minHaloBlur;
    const randomHaloOpacity = Math.random() * (maxHaloOpacity - minHaloOpacity) + minHaloOpacity;

    const blockRect = spaceElement.getBoundingClientRect();
    const minX = blockRect.left;
    const maxX = blockRect.right - maxStarSize;
    const minY = blockRect.top;
    const maxY = blockRect.bottom - maxStarSize;

    for (let i = 0; i < Math.min(numStarsOnStart, numStarsMax); i++) {
        const star = createStar();
        spaceElement.appendChild(star);
    }

    const createStarsInterval = setInterval(() => {
        const existingStars = spaceElement.getElementsByClassName('star').length;

        if (existingStars >= numStarsMax) {
            return;
        }
    
        for (let i = 0; i < Math.min(numStarsOnStart, maxStarsPerInterval); i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.position = 'absolute';
            star.style.zIndex = '-1';
            const starSize = getRandomSize(minStarSize, maxStarSize);
            star.style.width = starSize + 'px';
            star.style.height = starSize + 'px';
            star.style.backgroundColor = getRandomColor();
            star.style.borderRadius = '50%';
            star.style.opacity = 0;
            star.style.transition = 'opacity 0.3s ease-in-out';
        
            const randomX = getRandomX(movement, minX, maxX, starSize);
            const randomY = getRandomY(movement, minY, maxY, starSize);
            star.style.left = randomX + 'px';
            star.style.top = randomY + 'px';
    
        if (showHalo) {
            const halo = document.createElement('div');
            halo.classList.add('halo');
            halo.style.position = 'absolute';
            halo.style.width = starSize + 'px';
            halo.style.height = starSize + 'px';
            halo.style.borderRadius = '50%';
            halo.style.transition = 'opacity 0.3s ease-in-out';
            halo.style.backgroundColor = haloColor;
            halo.style.filter = `blur(${randomHaloBlur}px)`;
            halo.style.opacity = randomHaloOpacity;

            star.appendChild(halo);
        }

        spaceElement.appendChild(star);

        const appearDuration = getRandomDuration(minAppearDuration, maxAppearDuration);
        const disappearDuration = getRandomDuration(minDisappearDuration, maxDisappearDuration);
        const opacity = getRandomOpacity(minOpacity, maxOpacity);
    
        setTimeout(() => {

            star.style.opacity = opacity;
        
            if (showHalo) {
                const halo = star.querySelector('.halo');
                halo.style.opacity = opacity;
            }
    
            setTimeout(() => {
                star.style.opacity = 0;
                if (showHalo) {
                    const halo = star.querySelector('.halo');
                    halo.style.opacity = 0;
                }

                setTimeout(() => {
                    star.remove();
                }, 500); // Delay the removal of the star after fading out
                
                }, disappearDuration);

            }, appearDuration);
    
            const centerX = blockRect.left + blockRect.width / 2;
            const centerY = blockRect.top + blockRect.height / 2;
        
            const moveDirectionX = star.getBoundingClientRect().left - centerX;
            const moveDirectionY = star.getBoundingClientRect().top - centerY;
            const moveDistance = Math.sqrt(moveDirectionX ** 2 + moveDirectionY ** 2);
        
            const moveSpeed = getRandomDuration(minMoveSpeed, maxMoveSpeed);
            const moveDuration = moveDistance / moveSpeed * 1000;
    
            setTimeout(() => {
                star.style.transition = `left ${moveDuration}ms linear, top ${moveDuration}ms linear`;
                star.style.left = `${randomX + moveDirectionX}px`;
                star.style.top = `${randomY + moveDirectionY}px`;
            }, appearDuration);
        }
    }, intervalTiming);

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.position = 'absolute';
        star.style.zIndex = '-1';
        const starSize = getRandomSize(minStarSize, maxStarSize);
        star.style.width = starSize + 'px';
        star.style.height = starSize + 'px';
        star.style.backgroundColor = getRandomColor();
        star.style.borderRadius = '50%';
        star.style.opacity = 0;
        star.style.transition = 'opacity 0.3s ease-in-out';
    
        const randomX = getRandomX(movement, minX, maxX, starSize);
        const randomY = getRandomY(movement, minY, maxY, starSize);
        star.style.left = randomX + 'px';
        star.style.top = randomY + 'px';

        if (showHalo) {
            const halo = document.createElement('div');
            halo.classList.add('halo');
            halo.style.position = 'absolute';
            halo.style.width = starSize + 'px';
            halo.style.height = starSize + 'px';
            halo.style.borderRadius = '50%';
            halo.style.transition = 'opacity 0.3s ease-in-out';
            halo.style.backgroundColor = haloColor;
            halo.style.filter = `blur(${randomHaloBlur}px)`;
            halo.style.opacity = randomHaloOpacity;
    
            star.appendChild(halo);
        }

        return star;
    }

    function getRandomX(movement, minX, maxX, starSize) {
        if (movement === 'centerToSides') {
            const offsetX = starSize / 2;
            return Math.floor(Math.random() * (maxX - minX - offsetX + 1)) + minX;
        } else if (movement === 'sidesToCenter') {
            const offsetX = starSize / 2;
            return Math.floor(Math.random() * (maxX - minX - offsetX + 1)) + maxX - offsetX;
        } else {
            return Math.floor(Math.random() * ((maxX - minX) / 2 + 1)) + minX;
        }
    }
    
    function getRandomY(movement, minY, maxY, starSize) {
        if (movement === 'centerToSides' || movement === 'sidesToCenter') {
            const offsetY = starSize / 2;
            return Math.floor(Math.random() * (maxY - minY - offsetY + 1)) + minY;
        } else {
            return Math.floor(Math.random() * ((maxY - minY) / 2 + 1)) + minY;
        }
    }
}


function createStarsLayout() {
    const space = document.createElement('div');
    // space.classList.add('star-parent');

    space.style.position = 'relative';
    space.style.position = 'fixed';
    space.style.zIndex = '-1';
    space.style.top = '0';
    space.style.left = '0';
    space.style.width = '100%';
    space.style.height = '100%';

    return space;
}


function getRandomOpacity(minOpacity, maxOpacity) {
    return Math.random() * (maxOpacity - minOpacity) + minOpacity;
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


function getRandomSize(minSize, maxSize) {
    return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
}


function getRandomDuration(minDuration, maxDuration) {
    return Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
}


function countStars(ms = 10000) {
    console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    setInterval(() => {
        console.log( 'stars on the sky: ' + document.querySelectorAll('.star').length )
    }, ms)
}