/*
* @Author: Mesolaries
* @Date:   2019-09-03 16:38:45
* @Last Modified by:   Emil
* @Last Modified time: 2019-09-05 10:23:40
*/

// Drawing line functions

/**
 * [verticalLine description]
 * @param  {string} elementClass [Starting element html class]
 * @param  {array}  obstacles    [An array of all obstacles]
 * @param  {number} count        [Line counting]
 * @param  {string} hLineDir     [Last horizontal line direction]
 * @return {any}                 [Horizontal line function or stop executing]
 */
function verticalLine(elementClass, obstacles, count, hLineDir) {
    let element = $(elementClass);
    let target = $('.below');

    const targetHeight = Math.ceil(target.outerHeight());

    const targetXStart = Math.ceil(target.offset().left);
    const targetXCenter = Math.ceil(target.offset().left + target.outerWidth() / 2);
    const targetXEnd = Math.ceil(target.offset().left + target.outerWidth());
    const elementXStart = Math.ceil(element.offset().left);
    const elementXCenter = Math.ceil(element.offset().left + element.outerWidth() / 2);
    const elementXEnd = Math.ceil(element.offset().left + element.outerWidth());

    const targetYStart = Math.ceil(target.offset().top);
    const targetYCenter = Math.ceil(target.offset().top + target.outerHeight() / 2);
    const elementYStart = Math.ceil(element.offset().top);
    const elementYEnd = Math.ceil(element.offset().top + element.outerHeight());

    // Starting and ending y position
    let startPos = elementYEnd;
    let endPos = targetYStart;
    /**
     * [Vertical line start X position]
     * @var  {int}
     */
    let xPos = elementXCenter;


    let dir = getDirection(xPos, targetXCenter);
    if (count > 1) {
        xPos = elementXEnd;
        if (hLineDir === 'left') {
            xPos = elementXStart;
            dir = getDirection(elementXStart, targetXCenter);
        } else {
            dir = getDirection(elementXEnd, targetXCenter);
        }
    }

    if (xPos !== targetXCenter) {
        if (xPos >= targetXStart && xPos <= targetXEnd) {
            endPos = targetYStart - 5;
        } else {
            endPos = targetYCenter;
        }
    }


    count++;
    line = createLine(count, true);
    line.offset({ 'top': startPos, 'left': xPos });
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (
            obstacleInRange(startPos, endPos, obstacle.y) &&
            isInRange(xPos, obstacle.x, obstacle.w)
        ) {
            // Has obstacle
            endPos = obstacle.y - 5;
        }
    }

    // Vertical line length
    let length = endPos - startPos;

    // Drawing vertical line from bottom to top
    if (isInRange(elementYStart, targetYStart, targetHeight)) {
        xPos = elementXStart;
        if (dir === 'right') {
            xPos = elementXEnd;
        }
        startPos = elementYStart;
        endPos = startPos - 15;
        length = 15;
        line.offset({ 'top': endPos, 'left': xPos });
        line.css('width', length);
        return horizontalLine(`.line-${count}`, obstacles, count, wentUp = true);
    }

    // Drawing vertical line
    line.css('width', length);

    // Checking for target
    let lineX = line.offset().left;
    let lineY = line.offset().top + line.outerWidth();
    if (reachedTarget(lineX, lineY, Math.ceil(target.offset().left + (target.outerWidth() / 2)), target.offset().top)) {
        return;
    }

    return horizontalLine(`.line-${count}`, obstacles, count);
}

/**
 * [horizontalLine description]
 *
 * @param   {string}   elementClass  [Starting element html class]
 * @param   {array}    obstacles     [An array of all obstacles]
 * @param   {number}   count         [Line counting]
 * @param   {boolean}  wentUp        [true if last vertical line was drawen from bottom to top]
 *
 * @return  {any}                    [Call horizontalLineLeft function if direction is left ||
 *                                    Call verticalLine function ||
 *                                    Stop executing]
 */
function horizontalLine(elementClass, obstacles, count, wentUp = false) {
    let element = $(elementClass);
    let target = $('.below');

    const targetHeight = Math.ceil(target.outerHeight());

    const targetXStart = Math.ceil(target.offset().left);
    const targetXCenter = Math.ceil(target.offset().left + target.outerWidth() / 2);
    const elementXStart = Math.ceil(element.offset().left);
    const elementXCenter = Math.ceil(element.offset().left + element.outerWidth() / 2);
    const elementXEnd = Math.ceil(element.offset().left + element.outerWidth());

    const targetYStart = Math.ceil(target.offset().top);
    const targetYCenter = Math.ceil(target.offset().top + target.outerHeight() / 2);
    const elementYStart = Math.ceil(element.offset().top);
    const elementYCenter = Math.ceil(element.offset().top + element.outerHeight() / 2);
    const vLineYEnd = Math.ceil(element.offset().top + element.outerWidth());

    let dir = getDirection(elementXCenter, targetXCenter);
    let startPos = elementXEnd;
    let yPos = elementYCenter;
    let endPos = targetXStart;
    if (count >= 1) {
        // If horizontal line starting from vertical line
        dir = getDirection(elementXStart, targetXCenter);
        startPos = elementXStart;
        endPos = targetXCenter;
        yPos = vLineYEnd;
    }

    // Calling left going horizontal line
    if (dir === 'left') {
        return horizontalLineLeft(elementClass, obstacles, count, wentUp);
    }



    if (isInRange(yPos, targetYStart, targetHeight)) {
        endPos = targetXStart;
    }

    if (wentUp) {
        startPos = elementXStart;
        endPos = targetXCenter;
        yPos = elementYStart;
    }

    count++;
    let hLineDir = 'right';
    let line = createLine(count);
    line.offset({ 'top': yPos, 'left': startPos });

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (
            obstacleInRange(startPos, endPos, obstacle.x) &&
            isInRange(yPos, obstacle.y, obstacle.h)
        ) {
            // Has obstacle
            endPos = obstacle.x - 3;
        }
    }

    let length = endPos - startPos;

    line.css('width', length);

    let lineX = Math.ceil(line.offset().left + line.outerWidth());
    let lineY = Math.ceil(line.offset().top);
    if (reachedTarget(lineX, lineY, targetXStart, targetYCenter)) {
        return;
    }


    let spottedObstacle = hasObstacleBelow(line, target, obstacles, hLineDir);
    if (spottedObstacle) {
        length = spottedObstacle.x - startPos - 5;
        if (length < 0) {
            length *= -1;
            line.offset({ 'left': line.offset().left - length });
            hLineDir = 'left';
        }
        line.css('width', length);
    }
    return verticalLine(`.line-${count}`, obstacles, count, hLineDir);
}


function horizontalLineLeft(elementClass, obstacles, count, wentUp = false) {
    let element = $(elementClass);
    let target = $('.below');

    const targetHeight = Math.ceil(target.outerHeight());

    const targetXCenter = Math.ceil(target.offset().left + target.outerWidth() / 2);
    const targetXEnd = Math.ceil(target.offset().left + target.outerWidth());
    const elementXStart = Math.ceil(element.offset().left);

    const targetYStart = Math.ceil(target.offset().top);
    const targetYCenter = Math.ceil(target.offset().top + target.outerHeight() / 2);
    const elementYStart = Math.ceil(element.offset().top);
    const elementYCenter = Math.ceil(element.offset().top + element.outerHeight() / 2);
    const vLineYEnd = Math.ceil(element.offset().top + element.outerWidth());


    let startPos = elementXStart;
    let endPos = targetXCenter;
    let yPos = vLineYEnd;

    if (count < 1) {
        yPos = elementYCenter;
        endPos = targetXEnd;
    }

    if (isInRange(yPos, targetYStart, targetHeight)) {
        endPos = targetXEnd;
    }

    if (wentUp) {
        startPos = elementXStart;
        endPos = targetXCenter;
        yPos = elementYStart;
    }


    count++;
    let hLineDir = 'left';
    let line = createLine(count);
    line.offset({ 'top': yPos, 'left': startPos });

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (obstacleInRange(endPos, startPos, obstacle.x + obstacle.w) &&
            isInRange(yPos, obstacle.y, obstacle.h)
        ) {
            // Has obstacle
            endPos = obstacle.x + obstacle.w + 3;
        }
    }

    let length = (endPos - startPos) * -1;

    line.css('width', length);
    line.offset({ 'left': endPos });

    let lineX = Math.ceil(line.offset().left);
    let lineY = Math.ceil(line.offset().top);
    if (reachedTarget(lineX, lineY, targetXEnd, targetYCenter)) {
        return;
    }


    let spottedObstacle = hasObstacleBelow(line, target, obstacles, hLineDir);

    if (spottedObstacle) {
        length = spottedObstacle.x - startPos - 5;
        if (length < 0) {
            length *= -1;
            line.offset({ 'left': spottedObstacle.x - 5 });
        }
        line.css('width', length);
    }
    return verticalLine(`.line-${count}`, obstacles, count, hLineDir);
}


// Setup

 /**
* [elementsInArray description]
* @param  {string} elements [Jquery selector]
* @return {array}           [Returns all elements in array]
*/
function elementsInArray(elements) {
    let elementsArray = [];
    elements.each(function () {
        let offset = $(this).offset();
        let width = $(this).outerWidth();
        let height = $(this).outerHeight();
        elementsArray.push({
            'x': Math.ceil(offset.left),
            'y': Math.ceil(offset.top),
            'w': Math.ceil(width),
            'h': Math.ceil(height)
        });
    });
    return elementsArray;
}


/**
 * [deleteSelectedElement description]
 * @param  {string}   element [Jquery selector]
 * @param  {[array]}  array   [All elements array]
 * @return {[array], undefined}          [Returns array without selected element]
 */
function deleteSelectedElement(element, array) {
    let index = array.findIndex(
        e => e.x === Math.ceil($(element).offset().left) &&
            e.y === Math.ceil($(element).offset().top) &&
            e.w === Math.ceil($(element).outerWidth()) &&
            e.h === Math.ceil($(element).outerHeight())
    );
    if (index === -1) {
        return;
    }
    return array.splice(index, 1);
}


/**
 * [selectedElementsCount description]
 * @param  {string} selected [selected element Jquery selector]
 * @param  {int}    count    [count of already selected elements]
 * @return {int}             [count of selected elements]
 */
function selectedElementsCount(selected, count) {
    if (!$(selected).hasClass('selected') && count < 2) {
        count++;
        $(selected).addClass('selected count' + count);
    } else if (!$(selected).hasClass('selected') && count === 2) {
        $('.count2').removeClass();
        $(selected).addClass('selected count2');
    } else {
        if ($(selected).hasClass('count1')) {
            $('.count2').removeClass('count2').addClass('selected count1');
        }
        $(selected).removeClass();
        count--;
    }
    return count;
}


// Initialization
$(function () {
    let elements = $('a');
    let selectedCount = 0;
    let lineCount = 0;
    elements.on('click', function () {
        $('.line').remove();
        $('.above, .below').removeClass('above below');
        selectedCount = selectedElementsCount(this, selectedCount);
        if (selectedCount === 2) {
            let firstY = $('.count1').offset().top;
            let secondY = $('.count2').offset().top;
            if (firstY > secondY) {
                $('.count1').addClass('below');
                $('.count2').addClass('above');
            } else if (firstY <= secondY) {
                $('.count1').addClass('above');
                $('.count2').addClass('below');
            }
            // Adding elements to array
            let elementArray = elementsInArray(elements);
            deleteSelectedElement('.above', elementArray);
            deleteSelectedElement('.below', elementArray);
            if (firstY === secondY) {
                horizontalLine('.above', elementArray, lineCount);
            } else {
                verticalLine('.above', elementArray, lineCount);
            }
        }
    });
});