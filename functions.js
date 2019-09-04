function createLine(count, vertical = false) {
    $('body').append(`<div class="line line-${count}"></div>`);
    let createdLine = $(`.line-${count}`);
    if (vertical) {
        createdLine.css('transform', 'rotate(90deg)');
    }
    return createdLine;
}

function reachedTarget(lineX, lineY, targetX, targetY) {
    return lineX === targetX && lineY === targetY;
}


function getDirection(pos1, pos2) {
    if (pos1 > pos2) {
        return 'left';
    } else if (pos1 < pos2) {
        return 'right'
    }
    return 'same';
}

function hasObstacleBelow(element, target, obstacles, hLineDir) {
    let elementXPos = element.offset().left + element.outerWidth();
    if (hLineDir === 'left') {
        elementXPos = element.offset().left;
    }
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (obstacle.y >= element.offset().top && obstacle.y + obstacle.h <= target.offset().top && elementXPos >= obstacle.x && element.offset().left + element.outerWidth() <= obstacle.x + obstacle.w) {
            // has obstacle below
            return obstacle;
        }
    }
}


/**
 * [isInRange description]
 *
 * @param   {number}  xy1  [X or Y position of element to check]
 * @param   {number}  xy2  [X or Y position of target element]
 * @param   {number}  wh2  [Width or Height of target element]
 *
 * @return  {boolean}       [True or False]
 */
function isInRange(xy1, xy2, wh2) {
    return xy1 >= xy2 && xy1 <= xy2 + wh2;
}

/**
 * [obstacleInRange description]
 *
 * @param   {number}  start  [Start x/y position of horizontal/vertical line]
 * @param   {number}  end    [End x/y position of horizontal/vertical line]
 * @param   {number}  obst   [Obstacle x/y position in x/y range]
 *
 * @return  {boolean}         [True or False]
 */
function obstacleInRange(start, end, obst) {
    return start <= obst && end >= obst;
}