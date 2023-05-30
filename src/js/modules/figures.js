import {
    randomInteger,
    getColorInFilterFormat,
    setTransitionTemperory
} from  '../utils/functions.js';


export default function createFiguresBlock(
    recolorFrequency,
    recolorDuration,
    moveFrequency,
    moveDurationRange,
    maxAtOnce,
    makeAlive
) {

    createFiguresInParent(document.querySelector('.main'));

    if (makeAlive) {
        const figures = document.querySelectorAll('.main__figure');

        setInterval(() => {

            const figuresAtOnce = randomInteger(1, maxAtOnce);
            const figuresToMove = new Set();

            for (let i = 0; i < figuresAtOnce; i++) {

                const randomFigureIndex = randomInteger(0, figures.length - 1);
                const figure = figures[randomFigureIndex];
                const index = getElementIndex(figure);

                if (!figure.transitionMode && !figure.timeout) {
                    figuresToMove.add({index: index, element: figure})
                }
            }

            figuresToMove.forEach((figure) => {

                figure.element.timeout = true;

                // random time to start movement - less than movement frequency
                let startMovementInTime = moveFrequency * (randomInteger(0, 100) / 100);

                setTimeout(() => {

                    makeTransitionedChange(
                        figure.element,
                        `main__figure${figure.index}--changed`,
                        randomInteger(...moveDurationRange),
                        'transform'
                    );

                    // prevent this element from movement until next iteration
                    setTimeout(() => {
                        figure.element.timeout = false;
                    }, moveFrequency - startMovementInTime)

                }, startMovementInTime);
            })
        }, moveFrequency);


        const colorableFigures = document.querySelectorAll('.main__figure:not(.not-colorable)');

        setInterval(() => {
            const randomFigure = colorableFigures[randomInteger(0, colorableFigures.length - 1)];
            const isFree = !randomFigure.transitionMode && !randomFigure.timeout;

            if (isFree) {
                const randomColor = getColorInFilterFormat();

                if (!randomFigure.transitionMode) {
                    changeStyle(randomFigure, 'filter', randomColor, recolorDuration);
                }
            }
        }, recolorFrequency);
    }
}

function changeStyle(element, CSSprop, value, durationTime) {
    setTransitionTemperory(element, durationTime / 1000, CSSprop);
    element.style[CSSprop] = value;
}

function makeTransitionedChange(element, className, durationTime, transitionProperty) {
    setTransitionTemperory(element, durationTime / 1000, transitionProperty);
    element.classList.toggle(className);
}

function getElementIndex(element) {

    for (let className of element.classList) {

        let num = getNumberFromString(className);

        if (num) {
            num = stringifyNumber(num);
            return num;
        }
        
    }
    return null;


    function getNumberFromString(str) {
        const matches = str.match(/\d+/g); // Match one or more digits
      
        if (matches) {
          // Extract the first matched number
          const number = parseInt(matches[0], 10);
          return number;
        }
      
        return null; // No number found
    }
    
    function stringifyNumber(n) {
        return (n < 10) ? `0${n}` :`${n}`;
    }
}

function createFiguresInParent(parent) {
    const figuresHTML = `
        <img src="img/figures/figure-01.svg" id="figure01" class="main__figure main__figure01">
        <img src="img/figures/figure-02.svg" id="figure02" class="main__figure main__figure02 not-colorable">
        <img src="img/figures/figure-03.svg" id="figure03" class="main__figure main__figure03">
        <img src="img/figures/figure-04.svg" id="figure04" class="main__figure main__figure04">
        <img src="img/figures/figure-05.svg" id="figure05" class="main__figure main__figure05">
        <img src="img/figures/figure-06.svg" id="figure06" class="main__figure main__figure06 not-colorable">
        <img src="img/figures/figure-07.svg" id="figure07" class="main__figure main__figure07 not-colorable">
        <img src="img/figures/figure-08.svg" id="figure08" class="main__figure main__figure08 not-colorable">
        <img src="img/figures/figure-09.svg" id="figure09" class="main__figure main__figure09">
        <img src="img/figures/figure-10.svg" id="figure10" class="main__figure main__figure10">
        <img src="img/figures/figure-11.svg" id="figure11" class="main__figure main__figure11">
    `;

    const figures = document.createElement('section');
    figures.innerHTML = figuresHTML;
    figures.className = 'main__graphics';

    const photo = document.createElement('img');
    photo.src = 'img/laptop-men.png';
    photo.className = 'main__photo';
    photo.alt = 'Men with laptop photography'

    figures.appendChild(photo);
    parent.appendChild(figures);
}